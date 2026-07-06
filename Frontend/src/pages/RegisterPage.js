import { startRegistration } from "@simplewebauthn/browser";
import { API_URL } from "../utils/api.js";

export function renderRegisterPage(container) {
  container.innerHTML = `
    <section class="auth-page">
      <div class="auth-card">
        <h1>Đăng ký</h1>
        <p>Tạo tài khoản mới bằng mật khẩu hoặc khóa truy cập.</p>

        <form id="registerForm">
          <label>Họ và tên</label>
          <input type="text" id="fullName" required />

          <label>Email</label>
          <input type="email" id="email" required />

          <label>Mật khẩu</label>
          <input type="password" id="password" />

          <button type="submit">Đăng ký bằng mật khẩu</button>
        </form>

        <button id="passkeyRegisterBtn" class="passkey-login-btn">
          Đăng ký bằng khóa truy cập
        </button>

        <p class="auth-switch">
          Đã có tài khoản?
          <span onclick="navigate('login')">Đăng nhập</span>
        </p>

        <p id="registerStatus" class="passkey-status"></p>
      </div>
    </section>
  `;

  document.querySelector("#registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    await registerWithPassword();
  });

  document
    .querySelector("#passkeyRegisterBtn")
    .addEventListener("click", async () => {
      await registerWithPasskey();
    });
}

async function registerWithPassword() {
  const status = document.querySelector("#registerStatus");

  const fullName = document.querySelector("#fullName").value.trim();
  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value;

  if (!password) {
    status.textContent = "Vui lòng nhập mật khẩu hoặc chọn đăng ký bằng khóa truy cập.";
    return;
  }

  try {
    status.textContent = "Đang đăng ký...";

    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ fullName, email, password })
    });

    const result = await response.json();

    if (!response.ok) {
      status.textContent = result.message || "Đăng ký thất bại";
      return;
    }

    status.textContent = "Đăng ký thành công. Chuyển sang đăng nhập...";
    navigate("login");
  } catch (error) {
    status.textContent = "Không kết nối được backend.";
    console.error(error);
  }
}

async function registerWithPasskey() {
  const status = document.querySelector("#registerStatus");

  const fullName = document.querySelector("#fullName").value.trim();
  const email = document.querySelector("#email").value.trim();

  if (!fullName || !email) {
    status.textContent = "Vui lòng nhập họ tên và email trước khi đăng ký bằng khóa truy cập.";
    return;
  }

  try {
    status.textContent = "Đang tạo yêu cầu FIDO2...";

    const optionsResponse = await fetch(
      `${API_URL}/api/fido/register-direct/options`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ fullName, email })
      }
    );

    const options = await optionsResponse.json();

    if (!optionsResponse.ok) {
      status.textContent = options.message || "Không tạo được yêu cầu FIDO2.";
      return;
    }

    status.textContent = "Vui lòng xác nhận bằng Windows Hello / vân tay...";

    const attestationResponse = await startRegistration(options);

    status.textContent = "Đang xác minh khóa truy cập...";

    const verifyResponse = await fetch(
      `${API_URL}/api/fido/register-direct/verify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          attestationResponse
        })
      }
    );

    const result = await verifyResponse.json();

    if (!verifyResponse.ok) {
      status.textContent = result.message || "Đăng ký bằng khóa truy cập thất bại.";
      return;
    }

    localStorage.setItem("token", result.token);
    localStorage.setItem("currentUser", JSON.stringify(result.user));

    status.textContent = "Đăng ký bằng khóa truy cập thành công!";
    navigate("dashboard");
  } catch (error) {
    status.textContent = "Lỗi FIDO2: " + error.message;
    console.error(error);
  }
}
