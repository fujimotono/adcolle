(() => {
  "use strict";

  const menuButton = document.querySelector(".menu-button");
  const nav = document.querySelector(".global-nav");
  const backToTop = document.querySelector(".back-to-top");
  const form = document.querySelector(".contact-form");
  const year = document.querySelector("#current-year");
  const diagnosisForm = document.querySelector("#diagnosis-form");
  const diagnosisResult = document.querySelector(".diagnosis-result");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


  const scrollProgress = document.querySelector(".scroll-progress span");
  const hero = document.querySelector(".hero");
  const heroOrbOne = document.querySelector(".hero-orb-one");
  const heroOrbTwo = document.querySelector(".hero-orb-two");

  const updateScrollEffects = () => {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;

    if (scrollProgress) {
      scrollProgress.style.width = `${Math.min(progress * 100, 100)}%`;
    }

    if (!reduceMotion && hero) {
      const heroRect = hero.getBoundingClientRect();
      if (heroRect.bottom > 0) {
        const offset = Math.min(window.scrollY * .08, 70);
        if (heroOrbOne) heroOrbOne.style.transform = `translate3d(0, ${offset}px, 0)`;
        if (heroOrbTwo) heroOrbTwo.style.transform = `translate3d(0, ${-offset * .55}px, 0)`;
      }
    }
  };

  updateScrollEffects();
  window.addEventListener("scroll", updateScrollEffects, { passive: true });

  document.querySelectorAll(".stagger-group").forEach(group => {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      group.classList.add("visible");
      return;
    }

    const groupObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          groupObserver.unobserve(entry.target);
        }
      });
    }, { threshold: .14, rootMargin: "0px 0px -40px" });

    groupObserver.observe(group);
  });

  const counters = document.querySelectorAll(".counter");

  const animateCounter = element => {
    const target = Number(element.dataset.target || 0);
    const decimals = Number(element.dataset.decimals || 0);
    const prefix = element.dataset.prefix || "";
    const suffix = element.dataset.suffix || "";
    const duration = 1200;
    const start = performance.now();

    const frame = now => {
      const elapsed = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      const value = target * eased;
      element.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`;

      if (elapsed < 1) requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  };

  if (counters.length) {
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: .65 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".button").forEach(button => {
      button.classList.add("magnetic");

      button.addEventListener("mousemove", event => {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        button.style.transform = `translate(${x * .045}px, ${y * .08}px)`;
      });

      button.addEventListener("mouseleave", () => {
        button.style.transform = "";
      });
    });
  }


  const closeMenu = () => {
    if (!menuButton || !nav) return;
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "メニューを開く");
    document.body.classList.remove("menu-open");
  };

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
      document.body.classList.toggle("menu-open", open);
    });

    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 1024) closeMenu();
    });
  }

  const reveals = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(el => el.classList.add("visible"));
  } else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12, rootMargin: "0px 0px -35px" });
    reveals.forEach(el => observer.observe(el));
  }

  if (backToTop) {
    const update = () => backToTop.classList.toggle("show", window.scrollY > 600);
    update();
    window.addEventListener("scroll", update, { passive: true });
    backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));
  }

  if (year) year.textContent = String(new Date().getFullYear());


  if (diagnosisForm && diagnosisResult) {
    const steps = Array.from(diagnosisForm.querySelectorAll(".diagnosis-step"));
    const nextButton = diagnosisForm.querySelector(".diagnosis-next");
    const backButton = diagnosisForm.querySelector(".diagnosis-back");
    const progressBar = document.querySelector(".diagnosis-progress-bar");
    const retryButton = diagnosisResult.querySelector(".diagnosis-retry");
    const scoreElement = diagnosisResult.querySelector("#diagnosis-score");
    const titleElement = diagnosisResult.querySelector("#diagnosis-title");
    const messageElement = diagnosisResult.querySelector("#diagnosis-message");
    const adviceList = diagnosisResult.querySelector("#diagnosis-advice-list");
    const scoreCircle = diagnosisResult.querySelector(".score-circle");
    let currentStep = 0;

    const updateStep = () => {
      steps.forEach((step, index) => step.classList.toggle("active", index === currentStep));
      backButton.disabled = currentStep === 0;
      nextButton.textContent = currentStep === steps.length - 1 ? "結果を見る" : "次へ";
      progressBar.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
    };

    const getWeakItems = () => {
      const labels = [
        "ホームページと問い合わせ導線",
        "SNSの継続運用と成果測定",
        "動画の営業・広告活用",
        "アクセス解析と改善",
        "顧客管理と問い合わせ後の対応"
      ];
      return steps
        .map((step, index) => ({
          label: labels[index],
          value: Number(step.querySelector("input:checked")?.value ?? 0)
        }))
        .sort((a, b) => a.value - b.value)
        .slice(0, 3);
    };

    const showResult = () => {
      const selected = diagnosisForm.querySelectorAll("input:checked");
      const score = Array.from(selected).reduce((total, input) => total + Number(input.value), 0);
      const weakItems = getWeakItems();

      let title = "改善の余地が大きい状態です";
      let message = "施策を増やす前に、問い合わせまでの流れと優先順位を整理すると成果につながりやすくなります。";

      if (score >= 80) {
        title = "集客の土台が整っています";
        message = "現在の施策を数字で比較し、反応の良い媒体へ投資を集中させる段階です。";
      } else if (score >= 50) {
        title = "土台はありますが、連携が必要です";
        message = "個別の施策を問い合わせまでの一つの導線としてつなぐことで、成果を伸ばせる可能性があります。";
      }

      scoreElement.textContent = String(score);
      titleElement.textContent = title;
      messageElement.textContent = message;
      adviceList.innerHTML = weakItems.map(item => `<li>${item.label}</li>`).join("");
      scoreCircle.style.background =
        `radial-gradient(circle, #fff 57%, transparent 58%), conic-gradient(var(--blue) ${score * 3.6}deg, #e6edf7 0deg)`;

      diagnosisForm.hidden = true;
      diagnosisResult.hidden = false;
      diagnosisResult.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
    };

    nextButton.addEventListener("click", () => {
      const checked = steps[currentStep].querySelector("input:checked");
      if (!checked) {
        alert("回答を1つ選択してください。");
        return;
      }

      if (currentStep < steps.length - 1) {
        currentStep += 1;
        updateStep();
      } else {
        showResult();
      }
    });

    backButton.addEventListener("click", () => {
      if (currentStep > 0) {
        currentStep -= 1;
        updateStep();
      }
    });

    retryButton.addEventListener("click", () => {
      diagnosisForm.reset();
      currentStep = 0;
      diagnosisResult.hidden = true;
      diagnosisForm.hidden = false;
      updateStep();
    });

    updateStep();
  }


  if (form) {
    form.addEventListener("submit", event => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      alert("現在はデモフォームです。次の工程で実際の送信先を設定します。");
    });
  }
})();
