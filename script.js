/* ===== Atualiza automaticamente o ano no footer ===== */
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

/* ===== Scroll suave para links com âncora (#...) ===== */
document.addEventListener("click", (e) => {
  const link = e.target.closest ? e.target.closest('a[href*="#"]') : null;
  if (!link) return;

  const href = link.getAttribute("href");
  if (!href) return;

  // Suporta: "#section" e "index.html#section"
  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) return;

  const hash = href.slice(hashIndex);
  if (!hash || hash === "#") return;

  const id = hash.replace("#", "");
  const target = document.getElementById(id);

  // Só intercepta se o destino existe na página atual
  if (!target) return;

  e.preventDefault();

  target.scrollIntoView({ behavior: "smooth", block: "start" });

  // Fecha o menu móvel se estiver aberto
  const navPill = document.getElementById("navPill");
  if (navPill && navPill.classList.contains("expanded")) {
    navPill.classList.remove("expanded");
  }

  // Atualiza a URL com o hash (sem jump)
  history.pushState(null, "", `#${id}`);
});
