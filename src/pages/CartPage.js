import { products } from "../data/products.js";
import { formatPrice } from "../utils/format.js";
import { getCart, changeCartQty, removeFromCart } from "../utils/cart.js";

export function renderCartPage(container) {
  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = `
      <section class="container cart-page show">
        <h2>Giỏ hàng</h2>
        <p>Giỏ hàng đang trống.</p>
        <br>
        <button class="back-btn" onclick="navigate('home')">Tiếp tục mua sắm</button>
      </section>
    `;
    return;
  }

  let total = 0;

  const cartHtml = cart
    .map((cartItem) => {
      const product = products.find((item) => item.id === cartItem.id);
      total += product.price * cartItem.qty;

      return `
        <div class="cart-item">
          <div class="cart-thumb">${product.icon}</div>

          <div>
            <h3>${product.name}</h3>
            <p>${formatPrice(product.price)}</p>
          </div>

          <div class="qty-control">
            <button data-minus="${product.id}">-</button>
            <b>${cartItem.qty}</b>
            <button data-plus="${product.id}">+</button>
          </div>

          <button class="remove-btn" data-remove="${product.id}">
            Xóa
          </button>
        </div>
      `;
    })
    .join("");

  container.innerHTML = `
    <section class="container cart-page show">
      <h2>Giỏ hàng</h2>

      ${cartHtml}

      <div class="cart-total">Tổng tiền: ${formatPrice(total)}</div>

      <br>

      <button class="buy-btn">Thanh toán</button>
      <button class="back-btn" onclick="navigate('home')">Tiếp tục mua</button>
    </section>
  `;

  document.querySelectorAll("[data-minus]").forEach((button) => {
    button.addEventListener("click", () => {
      changeCartQty(Number(button.dataset.minus), -1);
      navigate("cart");
    });
  });

  document.querySelectorAll("[data-plus]").forEach((button) => {
    button.addEventListener("click", () => {
      changeCartQty(Number(button.dataset.plus), 1);
      navigate("cart");
    });
  });

  document.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      removeFromCart(Number(button.dataset.remove));
      navigate("cart");
    });
  });
}
