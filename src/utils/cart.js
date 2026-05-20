const CART_KEY = "techstore_cart";

export function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(productId) {
  const cart = getCart();
  const item = cart.find((cartItem) => cartItem.id === productId);

  if (item) {
    item.qty++;
  } else {
    cart.push({ id: productId, qty: 1 });
  }

  saveCart(cart);
}

export function removeFromCart(productId) {
  const cart = getCart().filter((item) => item.id !== productId);
  saveCart(cart);
}

export function changeCartQty(productId, delta) {
  let cart = getCart();
  const item = cart.find((cartItem) => cartItem.id === productId);

  if (!item) return;

  item.qty += delta;

  if (item.qty <= 0) {
    cart = cart.filter((cartItem) => cartItem.id !== productId);
  }

  saveCart(cart);
}

export function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}
