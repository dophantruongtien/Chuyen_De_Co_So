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

  let user;

  try {
    const response = await fetch(`${API_URL}/api/auth/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    user = await response.json();

    if (!response.ok) {
      throw new Error(user.message || "Không tải được thông tin dashboard");
    }
  } catch (error) {
    container.innerHTML = `
      <section class="container dashboard-page">
        <h2>Không tải được dashboard</h2>
        <p>${escapeHTML(error.message)}</p>
      </section>
    `;
    return;
  }

  const credentials = user.fidoCredentials || [];

  container.innerHTML = `
    <section class="container dashboard-page">
      <h1>Dashboard cá nhân</h1>

      <div class="dashboard-grid">
        <div class="profile-card">
          <div class="avatar">${escapeHTML(user.fullName.charAt(0).toUpperCase())}</div>
          <h2>${escapeHTML(user.fullName)}</h2>
          <p>${escapeHTML(user.email)}</p>
        </div>

        <div class="info-card">
          <h3>Thông tin tài khoản</h3>

          <div class="info-row">
            <span>Họ tên</span>
            <b>${escapeHTML(user.fullName)}</b>
          </div>

          <div class="info-row">
            <span>Email</span>
            <b>${escapeHTML(user.email)}</b>
          </div>

          <div class="info-row">
            <span>Số lượng khóa truy cập</span>
            <b>${credentials.length}</b>
          </div>

          <br>

          <button class="buy-btn" id="addPasskeyBtn">
            Thêm khóa truy cập
          </button>

          <p id="passkeyStatus" class="passkey-status"></p>

          <div class="passkey-section">
            <div class="passkey-section-header">
              <h3>Danh sách khóa truy cập</h3>
              <span>${credentials.length} khóa</span>
            </div>

            <div class="passkey-list">
              ${renderCredentialList(credentials)}
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  container
    .querySelector("#addPasskeyBtn")
    .addEventListener("click", async () => {
      await registerPasskey();
    });

  container.querySelectorAll(".delete-passkey-btn").forEach((button) => {
    button.addEventListener("click", async () => {
      await deletePasskey(button.dataset.credentialId);
    });
  });
}

function renderCredentialList(credentials) {
  if (!credentials.length) {
    return `
      <div class="empty-passkey">
        Chưa có khóa truy cập nào. Hãy thêm khóa để đăng nhập bằng Passkey.
      </div>
    `;
  }

  return credentials
    .map((credential, index) => {
      const transports = credential.transports?.length
        ? credential.transports.join(", ")
        : "Không rõ";

      return `
        <div class="passkey-item">
          <div>
            <b>Khóa truy cập ${index + 1}</b>
            <p>ID: ${formatCredentialID(credential.credentialID)}</p>
            <p>Thiết bị: ${escapeHTML(transports)}</p>
          </div>

          <button
            class="delete-passkey-btn"
            type="button"
            data-credential-id="${escapeHTML(credential._id)}"
          >
            Xóa
          </button>
        </div>
      `;
    })
    .join("");
}

function formatCredentialID(credentialID = "") {
  if (credentialID.length <= 18) {
    return escapeHTML(credentialID);
  }

  return `${escapeHTML(credentialID.slice(0, 8))}...${escapeHTML(
    credentialID.slice(-6)
  )}`;
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

async function deletePasskey(credentialId) {
  const token = getToken();
  const status = document.querySelector("#passkeyStatus");

  if (!confirm("Bạn có chắc muốn xóa khóa truy cập này?")) {
    return;
  }

  try {
    status.textContent = "Đang xóa khóa truy cập...";

    const response = await fetch(
      `${API_URL}/api/fido/credentials/${encodeURIComponent(credentialId)}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Không xóa được khóa truy cập");
    }

    status.textContent = "Đã xóa khóa truy cập.";
    navigate("dashboard");
  } catch (error) {
    status.textContent = "Lỗi: " + error.message;
    console.error(error);
  }
}

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };

    return entities[character];
  });
}
