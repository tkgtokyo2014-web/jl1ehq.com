/* JL1EHQ Official Website v2.0 — interactions */
(() => {
  "use strict";

  /* ---------- language toggle ---------- */
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
  const initial = saved || (navigator.language && navigator.language.startsWith("ja") ? "ja" : "en");
  applyLang(initial);
  langBtn.addEventListener("click", () =>
    applyLang(html.classList.contains("lang-ja") ? "en" : "ja"));

  /* ---------- mobile menu ---------- */
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");
  burger.addEventListener("click", () => nav.classList.toggle("open"));
  nav.addEventListener("click", (e) => { if (e.target.tagName === "A") nav.classList.remove("open"); });

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("on"); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  /* ---------- hero canvas: globe + waves + satellites ---------- */
  const cv = document.getElementById("heroCanvas");
  const ctx = cv.getContext("2d");
  let W, H, DPR, t = 0;
  const resize = () => {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * DPR; cv.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  };
  resize(); window.addEventListener("resize", resize);

  const stars = Array.from({ length: 130 }, () => ({
    x: Math.random(), y: Math.random(), r: Math.random() * 1.3 + .3, p: Math.random() * Math.PI * 2
  }));

  // wireframe globe
  const project = (lat, lon, R, cx, cy, rot) => {
    const la = lat * Math.PI / 180, lo = lon * Math.PI / 180 + rot;
    const x = R * Math.cos(la) * Math.sin(lo);
    const y = -R * Math.sin(la);
    const z = R * Math.cos(la) * Math.cos(lo);
    return { x: cx + x, y: cy + y * 0.96, z };
  };
  const drawGlobe = (cx, cy, R, rot) => {
    ctx.lineWidth = 1;
    for (let lat = -60; lat <= 60; lat += 30) {
      ctx.beginPath();
      for (let lon = 0; lon <= 360; lon += 6) {
        const p = project(lat, lon, R, cx, cy, rot);
        if (p.z < 0) { ctx.moveTo(p.x, p.y); continue; }
        ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = "rgba(77,195,255,0.14)"; ctx.stroke();
    }
    for (let lon = 0; lon < 360; lon += 30) {
      ctx.beginPath();
      let started = false;
      for (let lat = -90; lat <= 90; lat += 6) {
        const p = project(lat, lon, R, cx, cy, rot);
        if (p.z < 0) { started = false; continue; }
        if (!started) { ctx.moveTo(p.x, p.y); started = true; } else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = "rgba(77,195,255,0.12)"; ctx.stroke();
    }
    // rim glow
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(111,227,255,0.35)"; ctx.lineWidth = 1.4; ctx.stroke();
    const g = ctx.createRadialGradient(cx, cy, R * .82, cx, cy, R * 1.35);
    g.addColorStop(0, "rgba(47,124,255,0)"); g.addColorStop(.55, "rgba(47,124,255,0.10)"); g.addColorStop(1, "rgba(47,124,255,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R * 1.35, 0, Math.PI * 2); ctx.fill();
  };

  const frame = () => {
    t += 0.016;
    ctx.clearRect(0, 0, W, H);

    // stars
    stars.forEach((s) => {
      const a = 0.25 + 0.55 * Math.abs(Math.sin(t * 0.8 + s.p));
      ctx.fillStyle = `rgba(180,220,255,${a})`;
      ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2); ctx.fill();
    });

    const cx = W / 2, cy = H * 0.62, R = Math.min(W, H) * 0.34;
    drawGlobe(cx, cy, R, t * 0.12);

    // Tokyo beacon (approx lat 35.6, lon 139.7)
    const bp = project(35.6, 139.7, R, cx, cy, t * 0.12);
    if (bp.z >= 0) {
      // expanding radio waves
      for (let i = 0; i < 3; i++) {
        const ph = ((t * 0.5 + i / 3) % 1);
        ctx.beginPath(); ctx.arc(bp.x, bp.y, 6 + ph * 70, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(111,227,255,${0.5 * (1 - ph)})`; ctx.lineWidth = 1.4; ctx.stroke();
      }
      ctx.fillStyle = "#aee9ff";
      ctx.shadowColor = "#4dc3ff"; ctx.shadowBlur = 14;
      ctx.beginPath(); ctx.arc(bp.x, bp.y, 3.4, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
    }

    // DX arcs to random fixed points
    const targets = [[40, -74], [51, 0], [-33, 151], [34, -118], [1, 103]];
    targets.forEach((tp, i) => {
      const p2 = project(tp[0], tp[1], R, cx, cy, t * 0.12);
      if (bp.z < 0 || p2.z < 0) return;
      const mx = (bp.x + p2.x) / 2, my = Math.min(bp.y, p2.y) - 46;
      ctx.beginPath(); ctx.moveTo(bp.x, bp.y);
      ctx.quadraticCurveTo(mx, my, p2.x, p2.y);
      ctx.strokeStyle = "rgba(77,195,255,0.22)"; ctx.lineWidth = 1; ctx.stroke();
      // moving packet
      const ph = (t * 0.35 + i * 0.2) % 1;
      const qx = (1 - ph) * (1 - ph) * bp.x + 2 * (1 - ph) * ph * mx + ph * ph * p2.x;
      const qy = (1 - ph) * (1 - ph) * bp.y + 2 * (1 - ph) * ph * my + ph * ph * p2.y;
      ctx.fillStyle = "rgba(111,227,255,0.95)";
      ctx.beginPath(); ctx.arc(qx, qy, 1.8, 0, Math.PI * 2); ctx.fill();
    });

    // satellites
    for (let i = 0; i < 2; i++) {
      const ang = t * (0.35 + i * 0.13) + i * Math.PI;
      const sx = cx + Math.cos(ang) * R * 1.28;
      const sy = cy + Math.sin(ang) * R * 0.5;
      ctx.fillStyle = "#cfefff";
      ctx.shadowColor = "#6fe3ff"; ctx.shadowBlur = 10;
      ctx.fillRect(sx - 2, sy - 2, 4, 4);
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "rgba(111,227,255,0.5)";
      ctx.beginPath(); ctx.moveTo(sx - 8, sy); ctx.lineTo(sx + 8, sy); ctx.stroke();
    }
    requestAnimationFrame(frame);
  };
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) requestAnimationFrame(frame);
  else { drawGlobe(W / 2, H * 0.62, Math.min(W, H) * 0.34, 0.5); }

  /* ---------- blog (markdown, client-side) ---------- */
  const mdToHtml = (md) => {
    const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const inline = (s) => s
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy">')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
      .replace(/`([^`]+)`/g, "<code>$1</code>");
    const lines = esc(md).split("\n");
    let out = "", inList = false, para = [];
    const flush = () => { if (para.length) { out += "<p>" + inline(para.join("<br>")) + "</p>"; para = []; } };
    for (const raw of lines) {
      const l = raw.trimEnd();
      if (/^###\s/.test(l)) { flush(); out += "<h3>" + inline(l.slice(4)) + "</h3>"; }
      else if (/^##\s/.test(l)) { flush(); out += "<h2>" + inline(l.slice(3)) + "</h2>"; }
      else if (/^#\s/.test(l)) { flush(); out += "<h2>" + inline(l.slice(2)) + "</h2>"; }
      else if (/^[-*]\s/.test(l)) { flush(); if (!inList) { out += "<ul>"; inList = true; } out += "<li>" + inline(l.slice(2)) + "</li>"; }
      else if (l === "") { if (inList) { out += "</ul>"; inList = false; } flush(); }
      else para.push(l);
    }
    if (inList) out += "</ul>";
    flush();
    return out;
  };

  const blogGrid = document.getElementById("blogGrid");
  const articleView = document.getElementById("articleView");
  const articleBody = document.getElementById("articleBody");
  const openPost = async (post, lang) => {
    const file = (lang === "ja" ? post.file_ja : post.file_en) || post.file;
    const res = await fetch("blog/" + file);
    const md = await res.text();
    articleBody.innerHTML =
      `<h1>${lang === "ja" ? post.title_ja : post.title_en}</h1>` +
      `<div class="meta">${post.date} — JL1EHQ BLOG</div>` + mdToHtml(md);
    articleView.classList.add("open");
    document.body.style.overflow = "hidden";
  };
  document.getElementById("articleClose").addEventListener("click", () => {
    articleView.classList.remove("open");
    document.body.style.overflow = "";
  });

  fetch("blog/posts.json").then((r) => r.json()).then((posts) => {
    posts.forEach((p) => {
      const card = document.createElement("div");
      card.className = "post-card glass reveal on";
      card.innerHTML =
        `<div class="date">${p.date}</div>` +
        `<h3><span class="ja">${p.title_ja}</span><span class="en">${p.title_en}</span></h3>` +
        `<p><span class="ja">${p.summary_ja}</span><span class="en">${p.summary_en}</span></p>` +
        `<span class="more"><span class="ja">続きを読む →</span><span class="en">Read more →</span></span>`;
      card.addEventListener("click", () =>
        openPost(p, html.classList.contains("lang-ja") ? "ja" : "en"));
      blogGrid.appendChild(card);
    });
  }).catch(() => { blogGrid.innerHTML = "<p style='color:var(--text-dim)'>No posts yet.</p>"; });

  /* ---------- gallery lightbox ---------- */
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbCap = document.getElementById("lbCap");
  document.querySelectorAll(".g-item").forEach((it) => {
    it.addEventListener("click", () => {
      lbImg.src = it.dataset.full || it.querySelector("img").src;
      lbCap.textContent = it.querySelector(".cap").textContent.trim();
      lb.classList.add("open");
    });
  });
  lb.addEventListener("click", () => lb.classList.remove("open"));

  /* ---------- email (anti-scrape) ---------- */
  const em = document.getElementById("emailLink");
  if (em) {
    const addr = ["tt2833", "icloud.com"].join("@");
    em.addEventListener("click", (e) => { e.preventDefault(); location.href = "mailto:" + addr; });
  }
})();
