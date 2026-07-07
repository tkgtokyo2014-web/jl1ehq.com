/* JL1EHQ spec page — language toggle + reveal (shares localStorage with main site) */
(() => {
  "use strict";
  const html = document.documentElement;
  const langBtn = document.getElementById("langBtn");
  const applyLang = (lang) => {
    html.classList.toggle("lang-ja", lang === "ja");
    html.classList.toggle("lang-en", lang === "en");
    html.setAttribute("lang", lang);
    langBtn.textContent = lang === "ja" ? "🇺🇸 English" : "🇯🇵 日本語";
    localStorage.setItem("jl1ehq-lang", lang);
  };
  const saved = localStorage.getItem("jl1ehq-lang");
  applyLang(saved || (navigator.language && navigator.language.startsWith("ja") ? "ja" : "en"));
  langBtn.addEventListener("click", () =>
    applyLang(html.classList.contains("lang-ja") ? "en" : "ja"));

  const io = new IntersectionObserver((es) => {
    es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("on"); io.unobserve(e.target); } });
  }, { threshold: 0.06 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
})();
