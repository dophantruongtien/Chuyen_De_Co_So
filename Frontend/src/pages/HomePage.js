import { products } from "../data/products.js";
import { productCard, bindAddCartButtons } from "../components/ProductCard.js";
import { renderHeroSlider } from "../components/HeroSlider.js";

export function renderHomePage(container) {
  container.innerHTML = `
    <section id="homePage" class="container">
      <div id="sliderArea"></div>

      <h2 class="section-title">Danh mục nổi bật</h2>

      <section class="category-grid">
        <div class="category-card" data-category="Laptop">💻 Laptop</div>
        <div class="category-card" data-category="VGA">🎮 VGA</div>
        <div class="category-card" data-category="CPU">🧠 CPU</div>
        <div class="category-card" data-category="Monitor">🖥️ Monitor</div>
        <div class="category-card" data-category="Accessory">⌨️ Keyboard</div>
        <div class="category-card" data-category="Accessory">🖱️ Mouse</div>
      </section>

      <h2 class="section-title" id="productTitle">Sản phẩm bán chạy</h2>

      <section class="product-grid" id="productGrid"></section>
    </section>
  `;

  renderHeroSlider(document.querySelector("#sliderArea"));
  renderProducts(products);

  document.querySelectorAll("[data-category]").forEach((item) => {
    item.addEventListener("click", () => {
      filterProductsByCategory(item.dataset.category);
    });
  });

  window.addEventListener("filter-category", (event) => {
    filterProductsByCategory(event.detail);
  });

  window.addEventListener("search-product", (event) => {
    const keyword = event.detail.toLowerCase();

    const result = products.filter((product) =>
      product.name.toLowerCase().includes(keyword)
    );

    document.querySelector("#productTitle").textContent = "Kết quả tìm kiếm";
    renderProducts(result);
  });
}

function renderProducts(productList) {
  document.querySelector("#productGrid").innerHTML = productList
    .map((product) => productCard(product))
    .join("");

  bindAddCartButtons();
}

function filterProductsByCategory(category) {
  const filtered = products.filter((product) => product.category === category);

  document.querySelector("#productTitle").textContent = "Danh mục: " + category;

  renderProducts(filtered);
}
