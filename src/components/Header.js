import { getCartCount } from "../utils/cart.js";
import { getCurrentUser, logoutUser } from "../utils/auth.js";

const categories = [
  "Laptop",
  "Laptop Gaming",
  "PC GVN",
  "Main, CPU, VGA",
  "Case, Nguồn, Tản",
  "Ổ cứng, RAM, Thẻ nhớ",
  "Loa, Micro, Webcam",
  "Màn hình",
  "Bàn phím",
  "Chuột + Lót chuột",
  "Tai Nghe",
  "Ghế - Bàn",
  "Phần mềm, mạng",
  "Handheld, Console",
  "Phụ kiện",
  "Dịch vụ và thông tin khác"
];

export function renderHeader() {
  const user = getCurrentUser();

  document.querySelector("#header").innerHTML = `
    <header class="header">
      <div class="logo" onclick="navigate('home')">KMASTORE</div>

      <div class="category-wrapper">
        <button class="category-btn">
          ☰ Danh mục
        </button>

        <div class="category-dropdown">
          ${categories
            .map(
              (item) => `
              <div class="category-item" data-category="${item}">
                <span>${getIcon(item)} ${item}</span>
                <b>›</b>
              </div>
            `
            )
            .join("")}
        </div>
      </div>

      <div class="search-box">
        <input id="searchInput" type="text" placeholder="Bạn cần tìm gì?" />
        <button id="searchBtn">🔍</button>
      </div>

      <div class="header-actions">
        ${
          user
            ? `
              <button onclick="navigate('dashboard')">Tài khoản</button>
              <button id="logoutBtn">Đăng xuất</button>
            `
            : `
              <button onclick="navigate('login')">Đăng nhập</button>
              <button onclick="navigate('register')">Đăng ký</button>
            `
        }

        <button onclick="navigate('cart')">
          🛒 <span class="cart-count">${getCartCount()}</span>
        </button>
      </div>
    </header>
  `;

  document.querySelector("#searchBtn").addEventListener("click", () => {
    const keyword = document.querySelector("#searchInput").value;
    window.dispatchEvent(new CustomEvent("search-product", { detail: keyword }));
  });

  document.querySelectorAll(".category-item").forEach((item) => {
    item.addEventListener("click", () => {
      const category = item.dataset.category;
      window.dispatchEvent(
        new CustomEvent("filter-category", {
          detail: convertCategory(category)
        })
      );
    });
  });

  const logoutBtn = document.querySelector("#logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      logoutUser();
      navigate("home");
    });
  }
}

function getIcon(name) {
  if (name.includes("Laptop")) return "💻";
  if (name.includes("PC")) return "🖥️";
  if (name.includes("CPU") || name.includes("VGA")) return "🧠";
  if (name.includes("Case")) return "📦";
  if (name.includes("RAM") || name.includes("Ổ cứng")) return "💾";
  if (name.includes("Màn hình")) return "🖥️";
  if (name.includes("Bàn phím")) return "⌨️";
  if (name.includes("Chuột")) return "🖱️";
  if (name.includes("Tai")) return "🎧";
  if (name.includes("Ghế")) return "🪑";
  if (name.includes("Console")) return "🎮";
  return "▣";
}

function convertCategory(category) {
  if (category.includes("Laptop")) return "Laptop";
  if (category.includes("VGA")) return "VGA";
  if (category.includes("CPU")) return "CPU";
  if (category.includes("Màn hình")) return "Monitor";
  return "Accessory";
}