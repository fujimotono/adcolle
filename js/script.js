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
