import { startAuthentication } from "@simplewebauthn/browser";
import { API_URL } from "../utils/api.js";

export function renderLoginPage(container) {
  container.innerHTML = `
    <section class="auth-page">
      <div class="auth-card">
        <h1>Đăng nhập</h1>
        <p>Đăng nhập bằng mật khẩu hoặc Windows Hello / Passkey.</p>

        <form id="loginForm">
          <label>Email</label>
          <input type="email" id="email" placeholder="Nhập email" required />

          <label>Mật khẩu</label>
          <input type="password" id="password" placeholder="Nhập mật khẩu" required />

          <button type="submit">Đăng nhập</button>
        </form>

        <button id="passkeyLoginBtn" class="passkey-login-btn">
          Đăng nhập bằng khóa truy cập
        </button>

        <p class="auth-switch">
          Chưa có tài khoản?
          <span onclick="navigate('register')">Đăng ký ngay</span>
        </p>

        <p id="loginStatus" class="passkey-status"></p>
      </div>
    </section>
  `;

  const form = document.querySelector("#loginForm");
  const status = document.querySelector("#loginStatus");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    status.textContent = "Đang đăng nhập...";

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (!response.ok) {
        status.textContent = result.message || "Đăng nhập thất bại";
        return;
      }

      localStorage.setItem("token", result.token);
      localStorage.setItem("currentUser", JSON.stringify(result.user));

      status.textContent = "Đăng nhập thành công!";
      navigate("dashboard");
    } catch (error) {
      status.textContent = "Không kết nối được backend.";
      console.error(error);
    }
  });

  document
    .querySelector("#passkeyLoginBtn")
    .addEventListener("click", async () => {
      await loginWithPasskey();
    });
}

async function loginWithPasskey() {
  const status = document.querySelector("#loginStatus");
  const email = document.querySelector("#email").value;

  if (!email) {
    status.textContent = "Vui lòng nhập email trước khi đăng nhập bằng Passkey.";
    return;
  }

  try {
    status.textContent = "Đang tạo yêu cầu Passkey...";

    const optionsResponse = await fetch(`${API_URL}/api/fido/login/options`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });

    const options = await optionsResponse.json();

    if (!optionsResponse.ok) {
      status.textContent = options.message || "Không tạo được yêu cầu Passkey.";
      return;
    }

    status.textContent = "Vui lòng xác nhận bằng Windows Hello...";

    const authenticationResponse = await startAuthentication(options);

    status.textContent = "Đang xác minh Passkey...";

    const verifyResponse = await fetch(`${API_URL}/api/fido/login/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(authenticationResponse)
    });

    const result = await verifyResponse.json();

    if (!verifyResponse.ok) {
      status.textContent = result.message || "Đăng nhập Passkey thất bại.";
      return;
    }

    localStorage.setItem("token", result.token);
    localStorage.setItem("currentUser", JSON.stringify(result.user));

    status.textContent = "Đăng nhập Passkey thành công!";
    navigate("dashboard");
  } catch (error) {
    status.textContent = "Lỗi Passkey: " + error.message;
    console.error(error);
  }
}