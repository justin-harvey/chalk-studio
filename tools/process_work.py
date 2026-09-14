import os
from PIL import Image, ImageOps

SRC = "/home/nah/Claudia/Chalk Studio/work photos"
OUT = "/home/nah/Claudia/Chalk Studio/site/images/work"
os.makedirs(OUT, exist_ok=True)

# raw file -> semantic name + caption (service type)
MAP = {
    "7E96970A-0AB9-40B8-85D0-44B0F4280298.jpg": ("pink-orange-shag", "Vivid melt & curtain bangs"),
    "IMG_2652.JPG":                              ("pastel-melt",      "Pastel rainbow melt"),
    "C5656522-5967-4AF9-B389-7A0E01DBB88A.jpg":  ("rainbow-melt",     "Prism colour melt"),
    "97EDDFD6-3246-4839-9041-B7B6E88BA094.jpg":  ("green-curls",      "Emerald curly bob"),
    "9E4FC404-957A-45DF-ACBC-4D7D6E1477E9.jpg":  ("pink-undercut",    "Undercut colour design"),
    "img_3582.jpg":                              ("blush-editorial",  "Blush blonde, editorial"),
    "photos-1-7.jpeg":                           ("sunset-fringe",    "Sunset fringe & fashion colour"),
}

CAP = 1200   # long-edge cap
QUALITY = 84

for raw, (name, _cap) in MAP.items():
    path = os.path.join(SRC, raw)
    if not os.path.exists(path):
        print("MISSING", raw); continue
    im = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
    w, h = im.size
    if max(w, h) > CAP:
        s = CAP / max(w, h)
        im = im.resize((round(w*s), round(h*s)), Image.LANCZOS)
    out = os.path.join(OUT, name + ".jpg")
    im.save(out, "JPEG", quality=QUALITY, optimize=True, progressive=True)
    print(f"{name:18s} {im.size[0]}x{im.size[1]}  {os.path.getsize(out)//1024} KB")

# prune orphans
wanted = {n + ".jpg" for n, _ in MAP.values()}
for f in os.listdir(OUT):
    if f.endswith(".jpg") and f not in wanted:
        os.remove(os.path.join(OUT, f)); print("pruned", f)

print("\nDone ->", OUT)
