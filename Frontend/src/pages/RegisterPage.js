import { API_URL } from "../utils/api.js";

export function renderRegisterPage(container) {
  container.innerHTML = `
    <section class="auth-page">
      <div class="auth-card">
        <h1>Đăng ký</h1>
        <p>Tạo tài khoản mới.</p>

        <form id="registerForm">
          <label>Họ và tên</label>
          <input type="text" id="fullName" required />

          <label>Email</label>
          <input type="email" id="email" required />

          <label>Mật khẩu</label>
          <input type="password" id="password" required />

          <button type="submit">Đăng ký</button>
        </form>

        <p id="registerStatus" class="passkey-status"></p>
      </div>
    </section>
  `;

  document.querySelector("#registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const status = document.querySelector("#registerStatus");

    const fullName = document.querySelector("#fullName").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

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
  });
}
