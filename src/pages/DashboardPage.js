import { getCurrentUser } from "../utils/auth.js";
import { getCartCount } from "../utils/cart.js";

export function renderDashboardPage(container) {
  const user = getCurrentUser();

  if (!user) {
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
            <span>Số điện thoại</span>
            <b>${user.phone}</b>
          </div>

          <div class="info-row">
            <span>Địa chỉ</span>
            <b>${user.address}</b>
          </div>

          <div class="info-row">
            <span>Ngày tạo</span>
            <b>${user.createdAt}</b>
          </div>
        </div>

        <div class="stat-card">
          <h3>Giỏ hàng hiện tại</h3>
          <p class="stat-number">${getCartCount()}</p>
          <button class="buy-btn" onclick="navigate('cart')">Xem giỏ hàng</button>
        </div>

        <div class="stat-card">
          <h3>Đơn hàng</h3>
          <p class="stat-number">0</p>
          <p>Chưa có đơn hàng nào.</p>
        </div>
      </div>
    </section>
  `;
}
