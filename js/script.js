(() => {
  "use strict";

  const menuButton = document.querySelector(".menu-button");
  const globalNav = document.querySelector(".global-nav");
  const navLinks = document.querySelectorAll(".global-nav a");
  const backToTop = document.querySelector(".back-to-top");
  const contactForm = document.querySelector(".contact-form");
  const currentYear = document.querySelector("#current-year");

  const closeMenu = () => {
    if (!menuButton || !globalNav) return;
    globalNav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "メニューを開く");
    document.body.classList.remove("menu-open");
  };

  if (menuButton && globalNav) {
    menuButton.addEventListener("click", () => {
      const isOpen = globalNav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");
      document.body.classList.toggle("menu-open", isOpen);
    });

    navLinks.forEach((link) => link.addEventListener("click", closeMenu));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1024) closeMenu();
    });
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealElements = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px" }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  }

  if (backToTop) {
    const updateBackToTop = () => {
      backToTop.classList.toggle("show", window.scrollY > 500);
    };

    window.addEventListener("scroll", updateBackToTop, { passive: true });
    updateBackToTop();

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  if (currentYear) {
    currentYear.textContent = String(new Date().getFullYear());
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      window.alert(
        "現在はデモフォームです。公開前にフォームサービスまたはサーバー処理を接続してください。"
      );
    });
  }
})();
