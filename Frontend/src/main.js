import "./styles/style.css";

import { renderHeader } from "./components/Header.js";
import { renderFooter } from "./components/Footer.js";
import { renderHomePage } from "./pages/HomePage.js";
import { renderLoginPage } from "./pages/LoginPage.js";
import { renderRegisterPage } from "./pages/RegisterPage.js";
import { renderDashboardPage } from "./pages/DashboardPage.js";
import { renderCartPage } from "./pages/CartPage.js";
import { renderProductDetailPage } from "./pages/ProductDetailPage.js";
import { getCurrentUser } from "./utils/auth.js";

const app = document.querySelector("#app");

export async function navigate(page, params = {}) {
  app.innerHTML = `
    <div id="header"></div>
    <main id="page"></main>
    <div id="footer"></div>
  `;

  renderHeader();

  const pageContainer = document.querySelector("#page");

  if (page === "home") renderHomePage(pageContainer);
  if (page === "login") renderLoginPage(pageContainer);
  if (page === "register") renderRegisterPage(pageContainer);
  if (page === "dashboard") await renderDashboardPage(pageContainer);
  if (page === "cart") renderCartPage(pageContainer);
  if (page === "product-detail") renderProductDetailPage(pageContainer, params.id);

  renderFooter();
}

window.navigate = navigate;

window.addEventListener("DOMContentLoaded", () => {
  const user = getCurrentUser();
  console.log(user ? `Xin chào ${user.fullName}` : "Chưa đăng nhập");
  navigate("home");
});
