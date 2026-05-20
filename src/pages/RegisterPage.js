import { registerUser, loginUser } from "../utils/auth.js";

export function renderRegisterPage(container) {
  container.innerHTML = `
    <section class="auth-page">
      <div class="auth-card">
        <h1>Đăng ký</h1>
        <p>Tạo tài khoản mới để mua hàng nhanh hơn.</p>

        <form id="registerForm">
          <label>Họ và tên</label>
          <input type="text" id="fullName" placeholder="Nhập họ tên" required />

          <label>Email</label>
          <input type="email" id="email" placeholder="Nhập email" required />

          <label>Số điện thoại</label>
          <input type="text" id="phone" placeholder="Nhập số điện thoại" required />

          <label>Mật khẩu</label>
          <input type="password" id="password" placeholder="Nhập mật khẩu" required />

          <button type="submit">Tạo tài khoản</button>
        </form>

        <p class="auth-switch">
          Đã có tài khoản?
          <span onclick="navigate('login')">Đăng nhập</span>
        </p>
      </div>
    </section>
  `;

  document.querySelector("#registerForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const userData = {
      fullName: document.querySelector("#fullName").value,
      email: document.querySelector("#email").value,
      phone: document.querySelector("#phone").value,
      password: document.querySelector("#password").value
    };

    const result = registerUser(userData);

    alert(result.message);

    if (result.success) {
      loginUser(userData.email, userData.password);
      navigate("dashboard");
    }
  });
}
