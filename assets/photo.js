/* JL1EHQ — PHOTO page: language toggle + mobile menu + reveal + lightbox
   (shares the language setting with the rest of the site via localStorage) */
(() => {
  "use strict";

  /* ---------- language toggle ---------- */
  const html = document.documentElement;
  const langBtn = document.getElementById("langBtn");
  const applyLang = (lang) => {
    html.classList.toggle("lang-ja", lang === "ja");
    html.classList.toggle("lang-en", lang === "en");
    html.setAttribute("lang", lang);
    if (langBtn) langBtn.textContent = lang === "ja" ? "🇺🇸 English" : "🇯🇵 日本語";
    localStorage.setItem("jl1ehq-lang", lang);
    render();
  };
  const isJa = () => html.classList.contains("lang-ja");

  /* ---------- mobile menu ---------- */
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");
  if (burger && nav) {
    burger.addEventListener("click", () => nav.classList.toggle("open"));
    nav.addEventListener("click", (e) => { if (e.target.tagName === "A") nav.classList.remove("open"); });
  }

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver((es) => {
    es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("on"); io.unobserve(e.target); } });
  }, { threshold: 0.08 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  /* ---------- collections ---------- */
  const ORONKO = {
    dir: "images/photobook/",
    photos: [
      { id: "oronko-01", ja: "アザミ", en: "Thistle",
        ja_d: "棘に守られた蕾と、季節を終えた花がら。", en_d: "A bud armoured in spines, beside a flower whose season has ended." },
      { id: "oronko-02", ja: "綿毛のかかった実", en: "Seed down on a young hip",
        ja_d: "風に運ばれた綿毛が、若い実に引っかかっていた。", en_d: "Wind-borne down, snagged on a still-green rose hip." },
      { id: "oronko-03", ja: "黄色い野花", en: "Yellow wildflowers",
        ja_d: "草むらのなかで、小さな花がいくつも上を向く。", en_d: "Small blossoms turning upward out of the tall grass." },
      { id: "oronko-04", ja: "白い穂の花", en: "White flower spikes",
        ja_d: "細い茎の先で、白い穂がゆっくりと揺れる。", en_d: "Slender stems carrying pale spikes that sway in the sea wind." },
      { id: "oronko-05", ja: "淡紅の小花", en: "Pale pink blossoms",
        ja_d: "うすももいろの花が、寄り集まって咲く。", en_d: "A cluster of soft pink flowers opening together." },
      { id: "oronko-06", ja: "ハマナスの実", en: "Rose hip (hamanasu)",
        ja_d: "海霧に濡れた緑のなかで、実だけが灯りのように。", en_d: "In greenery wet with sea fog, only the fruit burns bright." },
      { id: "oronko-07", ja: "綿毛", en: "Seed heads",
        ja_d: "花が終わり、種を送り出す準備のかたち。", en_d: "Flowering over — the shape a plant takes to send its seeds away." },
      { id: "oronko-08", ja: "黄花と綿毛", en: "Bloom and down",
        ja_d: "咲く花と、飛び立つ綿毛が同じ枝に。", en_d: "One flower still open while the others are already leaving." },
      { id: "oronko-09", ja: "黄色い頭花の群れ", en: "Yellow button flowers",
        ja_d: "粒のような花が集まって、ひとつの塊になる。", en_d: "Bead-like heads gathering into a single golden mass." },
      { id: "oronko-10", ja: "白い散形花", en: "White umbel",
        ja_d: "放射状にひろがる白のなか、中心にひとつだけ濃い色の花。", en_d: "A radiating disc of white, with one dark floret at its centre." },
      { id: "oronko-11", ja: "茎をのぼる幼虫", en: "Caterpillar on a stem",
        ja_d: "綿毛のあいだを、黄と黒の幼虫がゆっくり進む。", en_d: "A yellow-and-black caterpillar climbing between the seed heads." },
      { id: "oronko-12", ja: "「お願い」の看板", en: "\"A Request\" — protection notice",
        ja_d: "「この地区は、多数の植物が群生し学術的にも貴重な地域」——北海道網走支庁の掲示。", en_d: "The local notice: this area is a designated academic nature preserve; picking or damaging plants is prohibited." },
      { id: "oronko-13", ja: "ハマナス", en: "Rosa rugosa (hamanasu)",
        ja_d: "濃い紅の花びらと、深い緑の葉。北の海辺の代表選手。", en_d: "Deep crimson petals over dark ribbed leaves — the signature flower of northern shores." },
      { id: "oronko-14", ja: "釣鐘の花", en: "Bellflower",
        ja_d: "うつむいて咲く、うす紫のベル。", en_d: "A pale violet bell, hanging its head." },
      { id: "oronko-15", ja: "オホーツクとオロンコ岩", en: "Oronko Rock and the Sea of Okhotsk",
        ja_d: "曇天の海へ、岩がまっすぐ突き出している。", en_d: "The rock pushing straight out into a grey, quiet sea." }
    ]
  };
  const COLLECTIONS = [ORONKO];

  /* flatten for the lightbox */
  const ALL = [];
  COLLECTIONS.forEach((c) => c.photos.forEach((p) => ALL.push({ ...p, dir: c.dir })));

  /* ---------- build grids ---------- */
  let built = false;
  const build = () => {
    if (built) return;
    COLLECTIONS.forEach((c, ci) => {
      const grid = document.querySelector(`[data-collection="${ci}"]`);
      if (!grid) return;
      grid.innerHTML = c.photos.map((p) => {
        const i = ALL.findIndex((x) => x.id === p.id);
        return `<button class="p-item" data-i="${i}" aria-label="${p.en}">
          <img src="${c.dir}${p.id}-thumb.jpg" alt="" loading="${i < 6 ? "eager" : "lazy"}" decoding="async" width="800" height="800">
          <div class="cap"><span class="ja">${p.ja}</span><span class="en">${p.en}</span></div>
        </button>`;
      }).join("");
    });
    built = true;
  };

  /* ---------- lightbox ---------- */
  const lb = document.getElementById("phLb");
  const lbImg = document.getElementById("phImg");
  const lbCap = document.getElementById("phCap");
  const lbCount = document.getElementById("phCount");
  let cur = 0, lastFocus = null;

  const render = () => {
    if (!lb || !lb.classList.contains("open")) return;
    const p = ALL[cur];
    lbImg.alt = isJa() ? p.ja : p.en;
    lbCap.innerHTML =
      `<span class="t"><span class="ja">${p.ja}</span><span class="en">${p.en}</span></span>` +
      `<span class="d"><span class="ja">${p.ja_d}</span><span class="en">${p.en_d}</span></span>`;
  };
  const show = (i) => {
    cur = (i + ALL.length) % ALL.length;
    const p = ALL[cur];
    lbImg.src = p.dir + p.id + ".jpg";
    lbCount.textContent = String(cur + 1).padStart(2, "0") + " / " + String(ALL.length).padStart(2, "0");
    render();
  };
  const open = (i) => {
    lastFocus = document.activeElement;
    lb.classList.add("open");
    show(i);
    document.body.style.overflow = "hidden";
    document.getElementById("phClose").focus();
  };
  const close = () => {
    lb.classList.remove("open");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  };

  document.addEventListener("click", (e) => {
    const b = e.target.closest(".p-item");
    if (b) open(+b.dataset.i);
  });
  if (lb) {
    document.getElementById("phClose").addEventListener("click", close);
    document.getElementById("phPrev").addEventListener("click", () => show(cur - 1));
    document.getElementById("phNext").addEventListener("click", () => show(cur + 1));
    lb.addEventListener("click", (e) => {
      if (e.target === lb || e.target.classList.contains("stage")) close();
    });
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(cur - 1);
      if (e.key === "ArrowRight") show(cur + 1);
    });
    let tx = 0;
    lb.addEventListener("touchstart", (e) => { tx = e.changedTouches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", (e) => {
      const d = e.changedTouches[0].clientX - tx;
      if (Math.abs(d) > 50) show(d < 0 ? cur + 1 : cur - 1);
    }, { passive: true });
  }

  /* ---------- go ---------- */
  build();
  const saved = localStorage.getItem("jl1ehq-lang");
  applyLang(saved || (navigator.language && navigator.language.startsWith("ja") ? "ja" : "en"));
  if (langBtn) langBtn.addEventListener("click", () => applyLang(isJa() ? "en" : "ja"));
})();
