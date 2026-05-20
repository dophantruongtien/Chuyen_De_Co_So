import { slides } from "../data/slides.js";

let currentSlide = 0;
let sliderInterval = null;

export function renderHeroSlider(container) {
  container.innerHTML = `
    <section class="hero" id="heroSlider"></section>
  `;

  const hero = document.querySelector("#heroSlider");

  function updateSlide() {
    hero.innerHTML =
      slides
        .map(
          (slide, index) => `
          <div 
            class="slide ${index === currentSlide ? "active" : ""}" 
            style="background:${slide.bg}"
          >
            <div class="slide-content">
              <h1>${slide.title}</h1>
              <p>${slide.text}</p>
              <button onclick="document.getElementById('productGrid').scrollIntoView({behavior:'smooth'})">
                Mua ngay
              </button>
            </div>
          </div>
        `
        )
        .join("") +
      `
      <div class="slider-dots">
        ${slides
          .map(
            (_, index) =>
              `<span class="dot ${index === currentSlide ? "active" : ""}"></span>`
          )
          .join("")}
      </div>
    `;
  }

  updateSlide();

  if (sliderInterval) clearInterval(sliderInterval);

  sliderInterval = setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlide();
  }, 3000);
}
