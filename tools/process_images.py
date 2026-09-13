import os
from PIL import Image, ImageOps

SRC = "/home/nah/Claudia/Chalk Studio/interior photos"
OUT = "/home/nah/Claudia/Chalk Studio/site/images"
os.makedirs(OUT, exist_ok=True)

# Map raw camera files -> semantic web names based on what each photo shows.
MAPPING = {
    "IMG_20260913_163243148_HDR.jpg": "hero-styling-floor",
    "IMG_20260913_163216859_HDR.jpg": "wash-stations",
    "IMG_20260913_163453539_HDR.jpg": "wash-stations-wide",
    "IMG_20260913_163504656_HDR.jpg": "reception",
    "IMG_20260913_163117637_HDR.jpg": "feature-wall-gold",
    "IMG_20260913_163438446_HDR.jpg": "styling-windows",
    "IMG_20260913_163551850_HDR.jpg": "floor-divider",
    "IMG_20260913_163618306_HDR.jpg": "styling-mirrors",
    "IMG_20260913_163337245_HDR.jpg": "scatter-wall",
    "IMG_20260913_163522259.jpg": "neon-sign",
    "IMG_20260913_163234159_HDR.jpg": "scarab-vanity",
    "IMG_20260913_163701067.jpg": "pattern-lines",
    "IMG_20260913_163844563_HDR.jpg": "pattern-wave",
    "IMG_20260913_164104665_HDR.jpg": "pattern-wave-2",
    "IMG_20260913_163639578_HDR_PORTRAIT.jpg": "detail-doll",
    "IMG_20260913_163715000_HDR_PORTRAIT.jpg": "detail-brass",
}

# Long-edge caps: heroes get more resolution.
HERO = {"hero-styling-floor", "wash-stations-wide", "neon-sign", "reception"}
MAXW_HERO = 2200
MAXW = 1600
QUALITY = 82

for raw, name in MAPPING.items():
    path = os.path.join(SRC, raw)
    if not os.path.exists(path):
        print("MISSING", raw)
        continue
    im = Image.open(path)
    im = ImageOps.exif_transpose(im)  # honor camera orientation
    im = im.convert("RGB")
    cap = MAXW_HERO if name in HERO else MAXW
    w, h = im.size
    if max(w, h) > cap:
        scale = cap / max(w, h)
        im = im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
    out = os.path.join(OUT, name + ".jpg")
    im.save(out, "JPEG", quality=QUALITY, optimize=True, progressive=True)
    kb = os.path.getsize(out) // 1024
    print(f"{name:22s} {im.size[0]}x{im.size[1]}  {kb} KB")

print("\nDone ->", OUT)
