/* ===== Atualiza automaticamente o ano no footer ===== */
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
