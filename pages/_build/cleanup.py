import re, pathlib
ROOT = pathlib.Path(r"C:\Users\studi.REAL\Documents\Devis\pages")
BAD = ("videos-3d", "hygiene-et-asepsie-au-cabinet", "honoraires-et-remboursements")
LI = re.compile(r'<li class="(?:menu-tab-container|menu-mobile-element)[^"]*">.*?</li>', re.S)
UNLINK = re.compile(r'<a href="https://dr-patrick-lellouche\.chirurgiens-dentistes\.fr/blog/articles/(?:honoraires-et-remboursements|les-bridges-et-ponts-dentaires|inlay-et-onlay-une-technique-conservatrice|les-facettes-en-ceramique)">(.*?)</a>', re.S)
def clean(t, is_page):
    t = LI.sub(lambda m: "" if any(b in m.group(0) for b in BAD) else m.group(0), t)
    t = t.replace("FICHES CONSEILS", "CONSEILS")
    t = UNLINK.sub(r"\1", t)
    if is_page:
        t = re.sub(r'<div class="container-light" id="subfooter">.*?</div></div></div>(?=\s*</div>|\s*\n\s*<button)', "", t, flags=re.S)
    return t
for p in list(ROOT.glob("*.html")) + [ROOT/"_build"/"implant.html", ROOT/"_build"/"couronne.html"]:
    s = p.read_text(encoding="utf-8"); n = clean(s, p.parent == ROOT)
    if n != s: p.write_text(n, encoding="utf-8"); print("updated", p.name)
