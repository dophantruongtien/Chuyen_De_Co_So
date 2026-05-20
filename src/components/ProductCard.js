import { formatPrice } from "../utils/format.js";
import { addToCart } from "../utils/cart.js";

export function productCard(product) {
  return `
    <div class="product-card">
      <div class="product-img">${product.icon}</div>

      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="price">${formatPrice(product.price)}</p>

        <div class="product-actions">
          <button class="detail-btn" onclick="navigate('product-detail', { id: ${product.id} })">
            Chi tiết
          </button>

          <button class="cart-btn" data-add-cart="${product.id}">
            Thêm giỏ
          </button>
        </div>
      </div>
    </div>
  `;
}

export function bindAddCartButtons() {
  document.querySelectorAll("[data-add-cart]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.addCart);
      addToCart(id);
      alert("Đã thêm sản phẩm vào giỏ hàng!");
      navigate("home");
    });
  });
}
