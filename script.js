// スムーススクロール
document.addEventListener("click", (e) => {
  const target = e.target.closest('a[href^="#"]');
  if (!target) return;

  const href = target.getAttribute("href");
  if (href === "#" || href === "#top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    e.preventDefault();
    return;
  }

  const el = document.querySelector(href);
  if (el) {
    const headerHeight = 64; // header高さと合わせる
    const rect = el.getBoundingClientRect();
    const offsetTop = window.pageYOffset + rect.top - headerHeight - 8;
    window.scrollTo({ top: offsetTop, behavior: "smooth" });
    e.preventDefault();
  }
});

// FAQアコーディオン（複数同時に開ける仕様）
document.querySelectorAll(".faq__item").forEach((item) => {
  const q = item.querySelector(".faq__question");
  const icon = item.querySelector(".faq__icon");

  q.addEventListener("click", () => {
    const willOpen = !item.classList.contains("is-open");

    // is-open の付け外しだけやる（アニメーションはCSSに任せる）
    if (willOpen) {
      item.classList.add("is-open");
      if (icon) icon.textContent = "−";
    } else {
      item.classList.remove("is-open");
      if (icon) icon.textContent = "＋";
    }
  });
});

// 「脈打つ」ボタンのクリック時アニメーション
document.querySelectorAll(".btn-pulse").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.style.transform = "scale(0.94)";
    setTimeout(() => {
      btn.style.transform = "scale(1)";
    }, 120);
  });
});

// 4週間プログラムのトグル
document.querySelectorAll(".program-item").forEach((item) => {
  const question = item.querySelector(".program-question");
  const icon = item.querySelector(".program-icon");

  question.addEventListener("click", () => {
    const willOpen = !item.classList.contains("is-open");

    if (willOpen) {
      item.classList.add("is-open");
      icon.textContent = "−"; // マイナスに
    } else {
      item.classList.remove("is-open");
      icon.textContent = "＋"; // プラスに戻す
    }
  });
});
// 最初だけ Week0 を自動で開いておきたい場合
const firstProgramItem = document.querySelector(".program-accordion .program-item");
if (firstProgramItem && !firstProgramItem.classList.contains("is-open")) {
  const firstBody = firstProgramItem.querySelector(".program-body");
  const firstToggle = firstProgramItem.querySelector(".program-toggle");
  firstProgramItem.classList.add("is-open");
  if (firstBody) firstBody.style.display = "block";
  if (firstToggle) firstToggle.textContent = "−";
}