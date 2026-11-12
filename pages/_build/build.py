"""Builds the implant / couronne pages from the saved /urgences page.

Run: python _build/build.py   (from the pages folder)
"""
import json, re, shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEMPLATE = ROOT / "Urgence dentaire à Charenton – Dentiste de garde (94).html"
FILES = "Urgence dentaire à Charenton – Dentiste de garde (94)_files"
SITE = "https://dr-patrick-lellouche.chirurgiens-dentistes.fr"

# Saved-page assets get an ASCII folder name so they load over any server/charset.
if not (ROOT / "assets").exists():
    shutil.copytree(ROOT / FILES, ROOT / "assets")


def img_tag(m):
    a = dict(re.findall(r'(\w+)="([^"]*)"', m.group(1)))
    name = a["name"]
    big = sorted(ROOT.glob(f"images/{name}-*.jpg"), key=lambda p: int(p.stem.rsplit("-", 1)[1]))
    srcset = ", ".join(f"images/{p.name} {p.stem.rsplit('-', 1)[1]}w" for p in big)
    w = int(big[-1].stem.rsplit("-", 1)[1])
    eager = a.get("eager") == "1"
    return (
        f'<img src="images/{big[0].name}" srcset="{srcset}" sizes="{a.get("sizes", "100vw")}" '
        f'alt="{a["alt"]}" style="object-position:{a.get("pos", "50% 50%")}" '
        f'{"fetchpriority=\"high\" " if eager else ""}decoding="async" width="{w}">'
    )


def build(slug, meta, content_file, schema):
    html = TEMPLATE.read_text(encoding="utf-8")
    # Strip browser-extension junk injected at save time.
    html = re.sub(r"<plasmo-csui>.*?</plasmo-csui>", "", html, flags=re.S)
    # Plausible analytics: removed on request (script file + init block).
    html = re.sub(r'<script async="" src="\./[^"]*pa-waT94pCb48KIcNMT-6IZr\.js[^"]*"></script>\s*', "", html)
    html = re.sub(r'<script>\s*window\.plausible=window\.plausible\|\|function\(\)\{.*?plausible\.init\(\);?\s*</script>\s*', "", html, flags=re.S)
    html = html[: html.index('<div class="axeptio_mount"')] + "</body></html>\n"
    html = html.replace("<head>", '<head><meta charset="utf-8">', 1)
    html = html.replace("</head>", '<link rel="stylesheet" href="css/lellouche-landing.css" media="all"></head>', 1)
    html = html.replace(f"./{FILES}/", "./assets/")

    url = f"{SITE}/{slug}"
    old_title = "Urgence dentaire à Charenton – Dentiste de garde (94)"
    html = html.replace(old_title, meta["title"])
    html = re.sub(r'(<meta (?:name|property)="(?:og:|twitter:)?description" content=")[^"]*', lambda m: m.group(1) + meta["description"], html)
    html = html.replace(f"{SITE}/urgences\">", f"{url}\">")  # canonical + og:url
    html = html.replace('<meta name="twitter:card" content="summary">', "")
    html = re.sub(r'<meta name="twitter:image:alt"[^>]*>', "", html)
    esc = lambda t: t.replace('"', "&quot;")
    head = "".join([
        f'<meta property="og:image" content="{meta["og_image"]}">',
        '<meta property="og:image:type" content="image/jpeg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">',
        f'<meta property="og:image:alt" content="{esc(meta["og_alt"])}">',
        f'<meta name="twitter:image" content="{meta["og_image"]}"><meta name="twitter:image:alt" content="{esc(meta["og_alt"])}">',
        f'<link rel="alternate" hreflang="fr" href="{url}"><link rel="alternate" hreflang="x-default" href="{url}">',
        '<meta name="geo.region" content="FR-94"><meta name="geo.placename" content="Charenton-le-Pont">',
        '<meta name="geo.position" content="48.82601;2.40664"><meta name="ICBM" content="48.82601, 2.40664">',
        '<meta name="author" content="Dr Patrick Lellouche">',
    ])
    html = html.replace("</head>", head + "</head>", 1)

    # Replace the page's own JSON-LD graph (Dentist + Person + homepage FAQ).
    html = re.sub(r'(<script type="application/ld\+json">\s*\{\s*"@context": "https://schema.org",\s*"@graph").*?</script>',
                  '<script type="application/ld+json">' + json.dumps(schema, ensure_ascii=False, indent=1) + "</script>",
                  html, count=1, flags=re.S)

    # Drop the other JSON-LD blocks of the saved page (WebSite, duplicate Dentist): ours carries them.
    html = re.sub(r'<script type="application/ld\+json">(?:(?!</script>).)*</script>', lambda m: m.group(0) if "MedicalWebPage" in m.group(0) else "", html, flags=re.S)

    html = html.replace("./assets/capture_d_ecran_2025-04-25_a_10-49-48.png", "images/webdentiste-light.png")

    # Menu: un-select URGENCES.
    html = html.replace('menu-mobile-element  selected', 'menu-mobile-element  ')

    content = (ROOT / "_build" / content_file).read_text(encoding="utf-8")
    content = re.sub(r"<pic ([^>]*)></pic>", img_tag, content)

    start = html.index('<div class="" id="h1">')
    # Outer content section ends right before the footer; drop it + sections-container + center_inner.
    tail = '\n</section>\n</div></div>'
    end = html.index(tail + '</div></div><div class="container-light" id="footer"') + len(tail)
    html = html[:start] + content + html[end:]

    (ROOT / f"{slug}.html").write_text(html, encoding="utf-8")
    print("wrote", slug + ".html")


def faq_schema(content_file):
    text = (ROOT / "_build" / content_file).read_text(encoding="utf-8")
    qa = re.findall(r"<details[^>]*><summary>(.*?)</summary>\s*<p>(.*?)</p>", text, flags=re.S)
    strip = lambda s: re.sub(r"<[^>]+>", "", s).strip()
    return {"@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": strip(q), "acceptedAnswer": {"@type": "Answer", "text": strip(a)}} for q, a in qa]}


IMG_HOME = "https://files.sbcdnsb.com/images/0_jH08J2FOMWwOo2n4SHIQ/content/1791292790/12062300/patrick-lellouche-chirurgiens-dentistes-sourire-dents-blanches-dl.jpeg"
WEBSITE = {"@type": "WebSite", "@id": f"{SITE}/#website", "name": "Dr Patrick Lellouche", "alternateName": "Cabinet dentaire du Dr Patrick Lellouche", "url": SITE, "inLanguage": "fr-FR"}
# Same entity (@id) as the homepage, so Google merges them: data copied from the live homepage JSON-LD.
DENTIST = {
    "@type": "Dentist", "@id": f"{SITE}/#business-CTHrRG2Gbh",
    "name": "Dr Patrick Lellouche", "alternateName": "Cabinet dentaire du Dr Patrick Lellouche", "url": SITE,
    "description": "Chirurgien-dentiste conventionné à Charenton-le-Pont : soins dentaires, implants, facettes, couronnes céramique, aligneurs transparents adultes, urgences dentaires.",
    "image": IMG_HOME, "telephone": "+33143680780",
    "address": {"@type": "PostalAddress", "streetAddress": "139 rue de Paris", "postalCode": "94220", "addressLocality": "Charenton-le-Pont", "addressCountry": "FR"},
    "geo": {"@type": "GeoCoordinates", "latitude": 48.82601, "longitude": 2.40664},
    "hasMap": "https://www.google.com/maps/search/?api=1&query=48.82601,2.40664",
    "openingHoursSpecification": [
        {"@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday", "Wednesday", "Thursday", "Friday"], "opens": "09:30", "closes": "19:00"}],
    "areaServed": ["Charenton-le-Pont", "Saint-Maurice", "Paris 12e", "Maisons-Alfort"],
    "availableLanguage": ["fr", "en", "es"], "medicalSpecialty": "Dentistry",
    "currenciesAccepted": "EUR", "paymentAccepted": "Carte Vitale, carte bancaire, espèces, chèque, virement",
    "hasOfferCatalog": {"@type": "OfferCatalog", "name": "Soins dentaires", "itemListElement": [
        {"@type": "Offer", "itemOffered": {"@type": "MedicalProcedure", "name": n}} for n in
        ("Implant dentaire", "Facettes dentaires en céramique", "Couronne dentaire céramique", "Aligneurs transparents adulte", "Urgence dentaire")]},
    "employee": {"@id": f"{SITE}/#dr-lellouche"},
    "sameAs": ["https://www.doctolib.fr/dentiste/charenton-le-pont/patrick-lellouche", "https://www.pagesjaunes.fr/pros/04532659"],
}
PERSON = {"@type": "Person", "@id": f"{SITE}/#dr-lellouche", "name": "Patrick Lellouche", "honorificPrefix": "Dr",
          "jobTitle": "Chirurgien-dentiste", "worksFor": {"@id": DENTIST["@id"]}, "knowsLanguage": ["fr", "en", "es"]}


def graph(slug, name, procedure, faq_file, og_image):
    url = f"{SITE}/{slug}"
    return {"@context": "https://schema.org", "@graph": [
        WEBSITE, DENTIST, PERSON,
        {"@type": "MedicalWebPage", "@id": url + "#page", "url": url, "name": name, "inLanguage": "fr-FR", "isPartOf": {"@id": WEBSITE["@id"]},
         "publisher": {"@id": DENTIST["@id"]}, "dateModified": "2026-10-22", "primaryImageOfPage": {"@type": "ImageObject", "url": og_image}, "breadcrumb": {"@id": url + "#breadcrumb"},
         "about": procedure, "author": {"@id": PERSON["@id"]}, "reviewedBy": {"@id": PERSON["@id"]},
         "lastReviewed": "2026-10-21"},
        {"@type": "BreadcrumbList", "@id": url + "#breadcrumb", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Accueil", "item": SITE + "/"},
            {"@type": "ListItem", "position": 2, "name": name, "item": url}]},
        faq_schema(faq_file),
    ]}


build("implant-dentaire-charenton-le-pont", {
    "title": "Implant dentaire à Charenton-le-Pont | Dr Lellouche",
    "description": "Pose d'implant dentaire à Charenton-le-Pont (métro Liberté) : bilan 3D, étapes, délais, coût et remboursement expliqués par le Dr Patrick Lellouche.",
    "og_image": f"{SITE}/images/og-implant-dentaire-1200x630.jpg",
    "og_alt": "Modèle d'implant dentaire examiné au cabinet du Dr Lellouche à Charenton-le-Pont",
}, "implant.html", graph("implant-dentaire-charenton-le-pont", "Implant dentaire", {
    "@type": "MedicalProcedure", "name": "Pose d'implant dentaire", "procedureType": "https://schema.org/SurgicalProcedure",
    "preparation": "Bilan clinique et radio panoramique 3D au cabinet",
    "howPerformed": "Pose sous anesthésie locale, cicatrisation osseuse de 3 mois, puis pose du pilier et de la couronne",
    "followup": "Contrôle au moins une fois par an"}, "implant.html", f"{SITE}/images/og-implant-dentaire-1200x630.jpg"))

build("couronne-dentaire-charenton-le-pont", {
    "title": "Couronne dentaire à Charenton-le-Pont | Dr Lellouche",
    "description": "Couronne céramique, zircone ou métallique à Charenton-le-Pont : indications, étapes, durée de vie et remboursement 100 % Santé. Cabinet du Dr Lellouche.",
    "og_image": f"{SITE}/images/og-couronne-dentaire-1200x630.jpg",
    "og_alt": "Couronne dentaire en céramique tenue à la pince au-dessus d'un modèle",
}, "couronne.html", graph("couronne-dentaire-charenton-le-pont", "Couronne dentaire", {
    "@type": "MedicalProcedure", "name": "Pose de couronne dentaire", "procedureType": "https://schema.org/TherapeuticProcedure",
    "preparation": "Examen, radio et devis ; dévitalisation ou inlay-core si nécessaire",
    "howPerformed": "Préparation de la dent sous anesthésie locale, empreinte, couronne provisoire, puis scellement de la couronne définitive",
    "followup": "Contrôle au moins une fois par an"}, "couronne.html", f"{SITE}/images/og-couronne-dentaire-1200x630.jpg"))


# post-process: menus, footer links, WD subfooter, non-client articles
import subprocess,sys
subprocess.run([sys.executable, str(__import__('pathlib').Path(__file__).with_name('cleanup.py'))], check=True)
