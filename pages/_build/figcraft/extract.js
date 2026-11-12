// Dumps every visual layer of the .lp block of a built page to JSON (absolute boxes, in document order).
// node extract.js <page.html> <out.json>
const { chromium } = require("C:/Users/studi.REAL/AppData/Roaming/npm/node_modules/@playwright/mcp/node_modules/playwright-core");
const path = require("path");
const fs = require("fs");

(async () => {
  const [, , html, out] = process.argv;
  const browser = await chromium.launch({ executablePath: "C:/Users/studi.REAL/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe" });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("file:///" + path.resolve(html).replace(/\\/g, "/"), { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(4000);
  await page.evaluate(async () => {
    document.querySelectorAll("details").forEach((d) => (d.open = true));
    document.querySelectorAll("img").forEach((i) => (i.loading = "eager"));
    await Promise.all([...document.querySelectorAll(".lp img")].map((i) => i.decode().catch(() => 0)));
    await document.fonts.ready;
  });
  const data = await page.evaluate(() => {
    const root = document.querySelector(".lp");
    const R = root.getBoundingClientRect();
    const L = [];
    const box = (r) => ({ x: r.left - R.left, y: r.top - R.top, w: r.width, h: r.height });
    const px = (v) => parseFloat(v) || 0;
    const alpha = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return 0; const p = m[1].split(/[ ,\/]+/); return p.length > 3 ? parseFloat(p[3]) : 1; };
    const hex = (c) => {
      const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null;
      const p = m[1].split(/[ ,\/]+/).map(parseFloat);
      const h = (n) => Math.round(n).toString(16).padStart(2, "0");
      return "#" + h(p[0]) + h(p[1]) + h(p[2]) + (p.length > 3 && p[3] < 1 ? h(p[3] * 255) : "");
    };
    const LEAF = new Set(["H1", "H2", "H3", "SUMMARY", "TD", "TH"]);
    const hasDirectText = (e) => [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    let stepN = 0;

    function emitText(e) {
      const cs = getComputedStyle(e);
      const text = e.textContent.replace(/\s+/g, " ").trim();
      if (!text) return;
      const rg = document.createRange(); rg.selectNodeContents(e);
      const tr = rg.getBoundingClientRect();
      const lh = cs.lineHeight === "normal" ? px(cs.fontSize) * 1.3 : px(cs.lineHeight);
      const single = tr.height <= lh * 1.6;
      const r = e.getBoundingClientRect();
      const b = single
        ? { x: tr.left - R.left, y: tr.top - R.top, w: tr.width + 2, h: tr.height }
        : { x: r.left - R.left + px(cs.paddingLeft), y: r.top - R.top + px(cs.paddingTop), w: r.width - px(cs.paddingLeft) - px(cs.paddingRight), h: r.height };
      L.push({ k: "text", ...b, text, single, family: cs.fontFamily.split(",")[0].replace(/["']/g, "").trim(), size: px(cs.fontSize), weight: +cs.fontWeight, lh, ls: cs.letterSpacing === "normal" ? 0 : px(cs.letterSpacing), align: cs.textAlign === "start" ? "left" : cs.textAlign, color: hex(cs.color), upper: cs.textTransform === "uppercase", name: text.slice(0, 40) });
    }

    function walk(e) {
      const cs = getComputedStyle(e);
      if (cs.display === "none" || cs.visibility === "hidden") return;
      const r = e.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return;
      const tag = e.tagName;
      if (tag === "IMG") {
        const o = getComputedStyle(e);
        L.push({ k: "img", ...box(r), src: e.currentSrc, nw: e.naturalWidth, nh: e.naturalHeight, fit: o.objectFit, pos: o.objectPosition, name: (e.alt || "image").slice(0, 60) });
        if (e.parentElement.classList.contains("hero")) L.push({ k: "grad", ...box(e.parentElement.getBoundingClientRect()) });
        return;
      }
      const bg = hex(cs.backgroundColor);
      if (bg && alpha(cs.backgroundColor) > 0 && e !== root) {
        L.push({ k: "rect", ...box(r), fill: bg, radius: px(cs.borderTopLeftRadius), name: e.className || tag.toLowerCase() });
      }
      const bw = ["Top", "Right", "Bottom", "Left"].map((s) => px(cs["border" + s + "Width"]));
      const bc = hex(cs.borderTopColor === "rgba(0, 0, 0, 0)" ? cs.color : cs.borderTopColor);
      if (bw.every((w) => w > 0 && w === bw[0]) && cs.borderTopStyle === "solid") {
        L.push({ k: "stroke", ...box(r), weight: bw[0], color: hex(cs.borderTopColor), radius: px(cs.borderTopLeftRadius) });
      } else {
        if (bw[2] > 0 && cs.borderBottomStyle === "solid") L.push({ k: "rect", x: r.left - R.left, y: r.bottom - R.top - bw[2], w: r.width, h: bw[2], fill: hex(cs.borderBottomColor), radius: 0, name: "border-bottom" });
        if (bw[3] > 0 && cs.borderLeftStyle === "solid") L.push({ k: "rect", x: r.left - R.left, y: r.top - R.top, w: bw[3], h: r.height, fill: hex(cs.borderLeftColor), radius: 0, name: "border-left" });
      }
      if (e.matches(".steps > li")) {
        stepN++;
        const x = r.left - R.left, y = r.top - R.top - 4;
        L.push({ k: "rect", x, y, w: 44, h: 44, fill: "#4f229e", radius: 22, name: "step-dot" });
        L.push({ k: "text", x: x, y: y + 6, w: 44, h: 32, text: String(stepN), single: false, family: "Playfair Display", size: 21, weight: 400, lh: 32, ls: 0, align: "center", color: "#ffffff", upper: false, name: "step " + stepN });
      }
      if (tag === "SUMMARY") L.push({ k: "text", x: r.right - R.left - 14, y: r.top - R.top, w: 14, h: 24, text: e.parentElement.open ? "–" : "+", single: true, family: "Marcellus", size: 24, weight: 400, lh: 24, ls: 0, align: "left", color: "#4f229e", upper: false, name: "toggle" });
      if (LEAF.has(tag) || hasDirectText(e)) {
        if (e.matches("li, p, a, span") && !hasDirectText(e)) { /* fallthrough to children */ } else { emitText(e); return; }
      }
      for (const c of e.children) walk(c);
    }
    walk(root);
    return { height: R.height, width: R.width, layers: L };
  });
  fs.writeFileSync(out, JSON.stringify(data, null, 1));
  console.log(out, data.layers.length, "layers", data.width + "x" + Math.round(data.height));
  await browser.close();
})();
