import { startRegistration } from "@simplewebauthn/browser";
import { API_URL, getToken } from "../utils/api.js";

export async function renderDashboardPage(container) {
  const token = getToken();

  if (!token) {
    container.innerHTML = `
      <section class="container dashboard-page">
        <h2>Bạn chưa đăng nhập</h2>
        <p>Vui lòng đăng nhập để xem thông tin cá nhân.</p>
        <br>
        <button class="buy-btn" onclick="navigate('login')">Đăng nhập</button>
      </section>
    `;
    return;
  }

  const response = await fetch(`${API_URL}/api/auth/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const user = await response.json();

  container.innerHTML = `
    <section class="container dashboard-page">
      <h1>Dashboard cá nhân</h1>

      <div class="dashboard-grid">
        <div class="profile-card">
          <div class="avatar">${user.fullName.charAt(0).toUpperCase()}</div>
          <h2>${user.fullName}</h2>
          <p>${user.email}</p>
        </div>

        <div class="info-card">
          <h3>Thông tin tài khoản</h3>

          <div class="info-row">
            <span>Họ tên</span>
            <b>${user.fullName}</b>
          </div>

          <div class="info-row">
            <span>Email</span>
            <b>${user.email}</b>
          </div>

          <div class="info-row">
            <span>Số lượng khóa truy cập</span>
            <b>${user.fidoCredentials?.length || 0}</b>
          </div>

          <br>

          <button class="buy-btn" id="addPasskeyBtn">
            Thêm khóa truy cập
          </button>

          <p id="passkeyStatus" class="passkey-status"></p>
        </div>
      </div>
    </section>
  `;

  document
    .querySelector("#addPasskeyBtn")
    .addEventListener("click", async () => {
      await registerPasskey();
    });
}

async function registerPasskey() {
  const token = getToken();
  const status = document.querySelector("#passkeyStatus");

  try {
    status.textContent = "Đang tạo yêu cầu FIDO2...";

    const optionsResponse = await fetch(
      `${API_URL}/api/fido/register/options`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const options = await optionsResponse.json();

    if (!optionsResponse.ok) {
      throw new Error(options.message || "Không tạo được options");
    }

    status.textContent = "Vui lòng xác nhận bằng Windows Hello / vân tay...";

    const attestationResponse = await startRegistration(options);

    status.textContent = "Đang xác minh khóa truy cập...";

    const verifyResponse = await fetch(
      `${API_URL}/api/fido/register/verify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(attestationResponse)
      }
    );

    const verifyResult = await verifyResponse.json();

    if (verifyResult.verified) {
      status.textContent = "Thêm khóa truy cập thành công!";
      alert("Đã thêm Passkey thành công!");
      navigate("dashboard");
    } else {
      status.textContent = "Xác minh thất bại.";
    }
  } catch (error) {
    status.textContent = "Lỗi: " + error.message;
    console.error(error);
  }
}