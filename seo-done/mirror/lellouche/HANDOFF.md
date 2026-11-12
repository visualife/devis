# Lellouche site: handoff (2026-11-12)

## Current state (2026-11-12)
- 2026-11-12: back-to-top circle (`#backtotop`) no longer turns purple after a click/tap: `:hover/:focus/:active` rule at the end of `responsive.css` keeps the white-centre progress ring and the purple arrow (it overrode the sticky `:hover` fill of `dynamic-styles.css`). Checked on `prendre-rdv.html`. Uncommitted.
- 2026-11-12: `prendre-rdv.html` dead space cut: Doctolib iframe height set by `contact-form.css` (700px under 640px wide, 600px above; shows the full motif list, no inner scrollbar), section paddings reduced (`container_59101474_inner` 20px 10px, `container_104673716_inner` 0 10px 30px), empty paragraphs/`<br />` between the two headings removed. Checked at 375px. Uncommitted.
- 2026-11-12: symptom checkboxes: no pills; 18px box when unticked, purple (#4f229e) V when ticked (SVG background on `::before`, in `contact-form.css`). Uncommitted.
- 2026-11-12: Oui/Non are plain radio circles (no pills), WD ring/dot centred in `contact-form.css`. Footer on all pages: "Confidentialité cookie" (link kept), "CGV" plain text (no link), other links unchanged. `cgu.html` page itself untouched. Uncommitted.
- 2026-11-12: `prendre-rdv.html`: COVID block removed (14-day contact title, 3 Oui/Non questions, 3 "Nombre de jour" inputs, "+" toggle, footnote). Oui/Non pills now sit on the same row as the question (2-option groups; the 3-option "enceinte" question wraps below). Fix lives in `contact-form.css` (needs `!important` over WD `application.css` flex-basis, and `display:none` on the WD clearfix `::before/::after` that added gaps). Checked at 375px, no horizontal scroll. Uncommitted.
- 2026-11-12: forms (`prendre-rdv.html`, `contactez-nous.html`) restyled via `public/assets/css/contact-form.css` (pill inputs, Oui/Non on one row at all widths, symptom checkboxes wrap several per row, tighter mobile padding, white `#subfooter` hidden on mobile). "Vérification de l'adresse email" removed. Checked at 375px (no horizontal scroll; prendre-rdv form 2638px, contact form 912px). Uncommitted.
- 2026-11-12: new folder `images t/` (9 candidate photos: veneers, inlays, smiles, stock) added at the project root, outside `public/`. Not used on any page yet; placement undecided. No site files changed.


Self-hosted copy, no more WD (Webdentiste) dependency except the open items below.
Deploy the `public/` folder. `_archive-httrack/` is the raw HTTrack mirror (safe to delete once happy).

## Layout
```
public/
  *.html (15 pages), llms.txt, 5c484d5e433a4cc397d21404a56f5526.txt (IndexNow key, must stay at root)
  blog/index.html, blog/articles/ (3 articles kept)
  assets/css  (theme, elements/, pages/<id>.css, dynamic-styles.css, lellouche-landing.css)
  assets/js   (app-main, app-visitor, theme-*, components/, photoswipe, sharer, vendor/)
  assets/img  (photos/, blog/, filters/, ui/)
```

## Done
- Blog cut to 3 articles + a plain `blog/index.html`; menu "FICHES CONSEILS" renamed "BLOG"; blog sidebar (search/tags) removed.
- Videos removed (menu, player modal, video script).
- WD removed: Matomo tracker, CSRF tags, admin script map, link/phone conversion tracking (disabled), Google Ads loader, hotlinks to WD CDN (all localised).
- Footer links "Hygiène & Asepsie" / "Honoraires & remboursement" removed (articles deleted).
- cgu.html + politique-de-confidentialite.html now use dr.lellouche.patrick@gmail.com (DPO line reduced to that single address).

- Cookie popup (Axeptio) removed from all pages, SDK deleted. GA4 sits in a consent `<template>` that only Axeptio activated, so GA4 is now OFF (Plausible was removed on 2026-11-12, so nothing measures visits). To re-enable GA4 you need a consent solution first (CNIL).
- Name unified to "Dr Patrick Lellouche" (JSON-LD name + alternateName, og:site_name, header and footer titles).
- sitemap.xml (18 URLs, clean URLs on dr-patrick-lellouche.chirurgiens-dentistes.fr) and robots.txt added; privacy/about/contact.html are redirect stubs.

- Hero photo: now the original smile files from `smile/correct` (`assets/img/hero/smile-*.jpg`), one per width via `responsive.css`. Closes tracker `hero`.
- Responsive pass: `assets/css/responsive.css` (linked last on every page; delete the link to revert). Justified text now left-aligned everywhere (no stretched word gaps), phone gutters 16px instead of 40-70px, hero shows the whole smile (was a 700px-tall crop), footer menus centred (no staircase), absolute desktop blocks stack on phones, price tables scroll inside their box, body clears the fixed bottom bar.

## TO CLEAN LATER

### Missing files (not in mirror, 404 on WD CDN: get from the Webdentiste admin / originals)
| What | Where it is referenced | Fix |
|---|---|---|
| Image id 10517611 `f5e2d5dc0d855f6e4f7320260720-154811-3u6n6i.jpeg` | `assets/css/pages/1657725.css` (100px bg) | put file in `assets/img/photos/`, update CSS URL |
| Image id 10517613 `2520ed0157031fe9f49520260720-154798-dyomv8.jpeg` | same | same |
| Image id 10517615 `01d53a75c9b91578e72d20260720-154805-f6znfy.webp` | same | same |
| `svg-filters/96848170/1791304290/filter.svg` | `assets/css/pages/1657725.css`, `url(/svg-filters/96848170/...)`, home decorative bg of container 96848170 | save as `assets/img/filters/96848170.svg`, change URL to `../img/filters/96848170.svg` |

Raw list: `missing-refs.txt`. Search both CSS references with `grep -n "10517611\|10517613\|10517615\|96848170" public/assets/css/pages/1657725.css`.

### Still tied to WD / third parties
- **Forms** (`contactez-nous.html`, `prendre-rdv.html`): action posts to `https://dr-patrick-lellouche.chirurgiens-dentistes.fr/api-website-feature/content-forms/…`, a WD backend. Needs own handler (owner will do).
- **mentions-legales.html**: "Éditeur et hébergeur du site" block still names ENPS / info@webdentiste.eu (address, RCS, fax, capital). Rewrite with cabinet as publisher + real host. Also "Responsable de la rédaction : [XX…" placeholder.
- **politique-de-confidentialite.html**: still mentions a HDS-certified hosting subcontractor (WD's); update to the real host.
- **Plausible** (`assets/js/vendor/plausible.js`, key `pa-waT94pCb48KIcNMT-6IZr`): check the accounts belong to the cabinet, not WD. GA4 `G-HPZ47PMVMT` stays.
- `appVisitor.config` in each page (`pagePath`, `sourcePageUrl`, `requestReferer`) still holds old domain values; harmless, remove with the CMS script when ready.

### Not doable on a static host (tracker items)
- Markdown responses for agents (`Accept: text/markdown`), real 301 redirects, root `/` serving French vs English: needs server config.

### Domain / URLs
- sitemap.xml, robots.txt and the privacy/about/contact stubs use the domain dr-patrick-lellouche.chirurgiens-dentistes.fr; change it if the final domain differs. Sitemap uses extensionless URLs (works on GitHub Pages).
- `canonical`, `og:url`, `hreflang` are relative (`index.html`). Make absolute once the final domain is fixed.
- `og:image`, `twitter:image` and JSON-LD images use `https://dr-patrick-lellouche.chirurgiens-dentistes.fr`; change if the domain differs.
- Pages link to `.html`; add clean-URL rewrites if `/le-cabinet` style is wanted (JSON-LD already uses clean URLs).

## 2026-11-12 — legal, footer, forms
- Plausible removed from every page (script file deleted).
- mentions-legales: publisher = cabinet, design = Ailive.fr (SIREN 439 830 654, taken from the vault), host = Vercel (assumed). Mediator line removed. politique-de-confidentialite: HDS wording replaced by Vercel + e-mail delivery. cgu: publisher = Ailive.fr.
- assets/css/footer.css (dark violet footer) linked on all pages.
- Forms: `assets/js/form-mail.js` replaces the old WD submit; posts JSON to `WEBHOOK_URL` (n8n). Workflow to import: `n8n/formulaire-cabinet.json` (Webhook -> Code -> Gmail to dr.lellouche.patrick@gmail.com). TODO: confirm the real n8n host in `WEBHOOK_URL`, set the Gmail credential, activate, send a real test.
- "plus de 33 ans" -> "plus de 35 ans" (4 pages).
- Local preview: `.claude/launch.json` (python static server, port 8123).
- 2026-11-12: n8n workflow created on https://ailive.app.n8n.cloud (id S0Bem54acUSf6aXe, inactive, existing "Gmail account" credential auto-attached). `WEBHOOK_URL` in form-mail.js now points to ailive.app.n8n.cloud. TODO: confirm Gmail credential is valid, publish, send one real test, then set tracker `contactform` to ok. A duplicate on local n8n (PcFvqbSxTZKEzgF0) can be deleted.
