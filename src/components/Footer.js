export function renderFooter() {
  document.querySelector("#footer").innerHTML = `
    <footer class="footer">
      <div>
        <h3>TechStore</h3>
        <p>Sàn thương mại điện tử công nghệ.</p>
      </div>

      <div>
        <h3>Hỗ trợ</h3>
        <p>Bảo hành</p>
        <p>Đổi trả</p>
      </div>

      <div>
        <h3>Liên hệ</h3>
        <p>support@techstore.vn</p>
        <p>1900 8888</p>
      </div>
    </footer>
  `;
}
