document.addEventListener("DOMContentLoaded", async () => {
  const mount = document.getElementById("navbar");
  if (!mount) return;

  try {
    // Resolve o caminho corretamente em qualquer página (index/about/book)
    const navbarUrl = new URL("navbar.html", window.location.href);

    const res = await fetch(navbarUrl, { cache: "no-cache" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const html = await res.text();
    mount.innerHTML = html;

    const navPill = document.getElementById("navPill");
    const hambMenu = document.getElementById("hambMenu");

    if (!navPill || !hambMenu) return;

    const setExpanded = (state) => {
      navPill.classList.toggle("expanded", state);
      hambMenu.setAttribute("aria-expanded", state ? "true" : "false");
    };

    const toggleExpanded = () => {
      const isOpen = navPill.classList.contains("expanded");
      setExpanded(!isOpen);
    };

    // Estado inicial (acessibilidade)
    hambMenu.setAttribute("aria-expanded", "false");

    // Click abre/fecha
    hambMenu.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleExpanded();
    });

    // Teclado (Enter / Space)
    hambMenu.addEventListener("keydown", (e) => {
      const key = e.key;
      if (key === "Enter" || key === " ") {
        e.preventDefault();
        toggleExpanded();
      }
    });

    // Fecha ao clicar em qualquer link do menu
    navPill.addEventListener("click", (e) => {
      const target = e.target;
      if (target && target.closest && target.closest(".nav-links a")) {
        setExpanded(false);
      }
    });

    // Fecha ao clicar fora
    document.addEventListener("click", (e) => {
      if (!navPill.contains(e.target)) {
        setExpanded(false);
      }
    });

    // Fecha ao apertar ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        setExpanded(false);
      }
    });

  } catch (err) {
    console.error("Erro ao carregar navbar:", err);
  }
});
