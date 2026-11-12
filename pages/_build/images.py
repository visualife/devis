"""Crops + resizes the source photos to JPG (quality 100, 4:4:4, no recompression tricks).

Run: python _build/images.py   (from the pages folder)
Output: images/<name>-<width>.jpg for each width in WIDTHS (480/800 for phones, 1300 max).
"""
from pathlib import Path
from PIL import Image

Image.MAX_IMAGE_PIXELS = None
ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT.parent / "articles images"
OUT = ROOT / "images"
WIDTHS = (480, 800, 1300)

# name: (source file, aspect w/h or None to keep, focus x, focus y)
IMAGES = {
    "implant-hero": ("replicate-prediction-hweb8bf2vnrmr0d1c7p9jdwmfr.png", 16 / 9, .5, .5),
    "couronne-hero": ("tmpikd1xbzh.png", 16 / 9, .5, .5),
    "structure-implant": ("Structure de  l'implant dentaire.png", None, .5, .5),
    "implant-radio": ("magnific__implant-panoramic-xray-unit-in-office-premium-back__71179.jpg", 2.2, .5, .42),
    "implant-teintier": ("close-up-hands-wearing-protective-gloves.jpg", 2.2, .5, .5),
    "implant-consultation": ("young-female-dentist-showing-patient-dental-xray-dentistry-concept.jpg", 2.2, .5, .4),
    "couronne-instruments": ("close-up-dentist-instruments.jpg", 2.2, .5, .45),
    "couronne-implants": ("dental-implants-model-dental-clinic.jpg", 2.2, .5, .5),
    "couronne-bouche": ("open-female-mouth-oral-checkup-dentist-selective-focus.jpg", 2.2, .5, .5),
    "cabinet-charenton": ("panoramic-photo-dental-office-with-all-work-tools.jpg", 2.2, .5, .55),
}

OUT.mkdir(exist_ok=True)
for name, (src, aspect, fx, fy) in IMAGES.items():
    im = Image.open(SRC / src)
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
        bg = Image.new("RGB", im.size, "white")
        bg.paste(im, mask=im.getchannel("A"))
        im = bg
    else:
        im = im.convert("RGB")
    w, h = im.size
    if aspect:
        if w / h > aspect:  # too wide: trim sides
            nw = round(h * aspect)
            x = min(max(round(w * fx - nw / 2), 0), w - nw)
            im = im.crop((x, 0, x + nw, h))
        else:  # too tall: trim top/bottom
            nh = round(w / aspect)
            y = min(max(round(h * fy - nh / 2), 0), h - nh)
            im = im.crop((0, y, w, y + nh))
    for tw in WIDTHS:
        r = im.resize((tw, round(im.height * tw / im.width)), Image.LANCZOS)
        r.save(OUT / f"{name}-{tw}.jpg", "JPEG", quality=100, subsampling=0)
    print(name, im.size)
