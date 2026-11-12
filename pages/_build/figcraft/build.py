"""layers JSON (extract.js) -> FigCraft command script. Run from the pages folder:
python _build/figcraft/build.py   then   figcraft-cli run _build/figcraft/script.json --out lellouche-pages.figcraft
"""
import json, re, subprocess, sys
from pathlib import Path
from urllib.parse import unquote
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
WORK = ROOT / "_build" / "figcraft"
CROPS = WORK / "crops"
CROPS.mkdir(exist_ok=True)
PAGES = [("Implant dentaire", "implant-dentaire-charenton-le-pont"), ("Couronne dentaire", "couronne-dentaire-charenton-le-pont")]
NODE = "node"

steps = []
def add(cmd, **params):
    steps.append({"command": cmd, "params": params}); return len(steps) - 1

def crop(layer, tag, i):
    """Cover-crop the source to the box with its object-position, so FigCraft gets the exact visible pixels (no stretch)."""
    src = ROOT / unquote(layer["src"].split("/pages/")[-1])
    big = sorted(src.parent.glob(src.stem.rsplit("-", 1)[0] + "-*.webp"), key=lambda p: int(p.stem.rsplit("-", 1)[1]))[-1]
    im = Image.open(big).convert("RGB")
    bw, bh = layer["w"], layer["h"]
    if layer["fit"] == "cover":
        s = max(bw / im.width, bh / im.height)
        vw, vh = bw / s, bh / s  # visible window in source px
        px, py = [float(v.strip("%")) / 100 for v in layer["pos"].split()]
        x0, y0 = (im.width - vw) * px, (im.height - vh) * py
        im = im.crop((round(x0), round(y0), round(x0 + vw), round(y0 + vh)))
    out = CROPS / f"{tag}-{i}.jpg"
    im.save(out, quality=92)
    return str(out)

def paint_text(t, parent, dx, dy):
    props = {"fontFamily": t["family"], "fontSize": t["size"], "lineHeight": round(t["lh"], 2), "letterSpacing": round(t["ls"], 2),
             "textAlign": t["align"], "fill": t["color"], "textAutoResize": "widthAndHeight" if t["single"] else "height"}
    if t["weight"] >= 600: props["fontStyle"] = "Bold"
    if t["upper"]: props["textCase"] = "upper"
    p = dict(type="text", parent=parent, x=round(t["x"]), y=round(t["y"]), text=t["text"], name=t["name"], props=props)
    if not t["single"]: p["width"] = round(t["w"] + 1)
    add("node.create", **p)

for n, (title, slug) in enumerate(PAGES):
    js = WORK / f"{slug}.json"
    subprocess.run([NODE, str(WORK / "extract.js"), str(ROOT / f"{slug}.html"), str(js)], check=True)
    data = json.loads(js.read_text(encoding="utf-8"))
    frame = add("node.create", type="frame", name=title, x=n * 1600, y=0, width=1440, height=round(data["height"]),
                props={"clip": True, "fill": "#ffffff"}, select=False)
    parent = frame + 2  # ids are assigned in step order, first layer is 2
    for i, l in enumerate(data["layers"]):
        k = l["k"]
        if k == "rect":
            add("node.create", type="rectangle", parent=parent, x=round(l["x"], 1), y=round(l["y"], 1), width=round(l["w"], 1), height=max(round(l["h"], 1), 0.5),
                name=l["name"][:40], props={"fill": l["fill"], "cornerRadius": min(l["radius"], l["h"] / 2)}, select=False)
        elif k == "stroke":
            add("node.create", type="rectangle", parent=parent, x=round(l["x"], 1), y=round(l["y"], 1), width=round(l["w"], 1), height=round(l["h"], 1),
                name="outline", props={"fills": [], "stroke": l["color"], "strokeWeight": l["weight"], "strokeAlign": "inside", "cornerRadius": min(l["radius"], l["h"] / 2)}, select=False)
        elif k == "grad":
            add("node.create", type="rectangle", parent=parent, x=round(l["x"], 1), y=round(l["y"], 1), width=round(l["w"], 1), height=round(l["h"], 1), name="hero overlay",
                props={"fills": [{"type": "gradient", "visible": True, "width": [-1.0, 0.0], "kind": "linear", "from": [0.5, 0], "to": [0.5, 1], "opacity": 1, "blend": "normal", "stops": [
                    {"color": {"r": 0.1137, "g": 0.0706, "b": 0.2118, "a": a}, "position": pos} for a, pos in ((0.15, 0), (0.78, 1))]}]}, select=False)
        elif k == "img":
            f = crop(l, slug, i)
            add("image.place", path=f, parent=parent, x=round(l["x"], 1), y=round(l["y"], 1), width=round(l["w"], 1), height=round(l["h"], 1), mode="fill")
        elif k == "text":
            paint_text(l, parent, 0, 0)

(WORK / "script.json").write_text(json.dumps(steps, ensure_ascii=False), encoding="utf-8")
print(len(steps), "steps")
