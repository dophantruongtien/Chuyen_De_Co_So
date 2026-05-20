import { loginUser } from "../utils/auth.js";

export function renderLoginPage(container) {
  container.innerHTML = `
    <section class="auth-page">
      <div class="auth-card">
        <h1>Đăng nhập</h1>
        <p>Đăng nhập để quản lý tài khoản và giỏ hàng.</p>

        <form id="loginForm">
          <label>Email</label>
          <input type="email" id="email" placeholder="Nhập email" required />

          <label>Mật khẩu</label>
          <input type="password" id="password" placeholder="Nhập mật khẩu" required />

          <button type="submit">Đăng nhập</button>
        </form>

        <p class="auth-switch">
          Chưa có tài khoản?
          <span onclick="navigate('register')">Đăng ký ngay</span>
        </p>
      </div>
    </section>
  `;

  document.querySelector("#loginForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const result = loginUser(
      document.querySelector("#email").value,
      document.querySelector("#password").value
    );

    alert(result.message);

    if (result.success) {
      navigate("dashboard");
    }
  });
}
