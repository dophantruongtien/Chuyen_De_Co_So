import { products } from "../data/products.js";
import { formatPrice } from "../utils/format.js";
import { addToCart } from "../utils/cart.js";

export function renderProductDetailPage(container, id) {
  const product = products.find((item) => item.id === Number(id));

  if (!product) {
    container.innerHTML = `
      <section class="container detail-page show">
        <h2>Không tìm thấy sản phẩm</h2>
        <button class="back-btn" onclick="navigate('home')">Quay lại</button>
      </section>
    `;
    return;
  }

  container.innerHTML = `
    <section class="container detail-page show">
      <div class="detail-layout">
        <div class="detail-image">${product.icon}</div>

        <div class="detail-info">
          <h1>${product.name}</h1>
          <p class="price">${formatPrice(product.price)}</p>
          <p><b>Danh mục:</b> ${product.category}</p>
          <p>${product.desc}</p>

          <button class="buy-btn" id="addDetailCart">
            Thêm vào giỏ hàng
          </button>

          <button class="back-btn" onclick="navigate('home')">
            Quay lại
          </button>
        </div>
      </div>
    </section>
  `;

  document.querySelector("#addDetailCart").addEventListener("click", () => {
    addToCart(product.id);
    alert("Đã thêm sản phẩm vào giỏ hàng!");
    navigate("cart");
  });
}
