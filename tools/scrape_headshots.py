"""
Collect stylist headshots from the Slate Studio site (sister salon).

Same harness pattern as scrape_slate.py: fetch the page, parse with
BeautifulSoup, then map each Wix headshot image to the stylist name that
follows it in document order. Downloads a higher-res version and produces
square, web-optimized JPumbs for the Chalk site.
"""
import os
import re
import requests
from bs4 import BeautifulSoup
from PIL import Image, ImageOps
from io import BytesIO

PAGE = "https://www.slatestudioportland.com/stylists-re"
RAW_DIR = "/home/nah/Claudia/Chalk Studio/headshots_raw"
OUT_DIR = "/home/nah/Claudia/Chalk Studio/site/images/stylists"
HEADERS = {"User-Agent": "Mozilla/5.0"}
SIZE = 640          # final square px
QUALITY = 84

os.makedirs(RAW_DIR, exist_ok=True)
os.makedirs(OUT_DIR, exist_ok=True)

# alt text of the shared "coming soon" placeholder Wix uses — skip only that.
# (Note: some real photos have generic alts like "Rectangle 1.png", so don't
#  filter on "rectangle".)
PLACEHOLDER_HINTS = ("bio_temp",)


def hi_res(src):
    """Rewrite a Wix media URL to a clean square high-res fetch."""
    m = re.search(r"(fa8705_[0-9a-f]+~mv2\.(?:png|jpg|jpeg))", src, re.I)
    if not m:
        return src
    base, ext = m.group(1), m.group(1).split(".")[-1]
    return (f"https://static.wixstatic.com/media/{base}"
            f"/v1/fill/w_800,h_800,al_c,q_90/file.{ext}")


def slug(name):
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


print(f"Fetching {PAGE} ...")
res = requests.get(PAGE, headers=HEADERS, timeout=10)
soup = BeautifulSoup(res.text, "html.parser")

# Walk the document; remember the last stylist headshot seen, then attach it
# to the next heading (the stylist's name).
found = {}
pending_img = None
for el in soup.find_all(["img", "h1", "h2", "h3"]):
    if el.name == "img":
        src = el.get("src", "")
        alt = (el.get("alt") or "").lower()
        if "wixstatic.com/media/fa8705_" not in src:
            continue
        if any(h in alt for h in PLACEHOLDER_HINTS):
            pending_img = None
            continue
        pending_img = src
    else:
        name = el.get_text(strip=True)
        if pending_img and name and len(name) < 24 and name.replace(" ", "").isalpha():
            found.setdefault(name, pending_img)
            pending_img = None

print(f"Matched {len(found)} stylist headshots:\n")
for name, src in found.items():
    url = hi_res(src)
    try:
        r = requests.get(url, headers=HEADERS, timeout=15)
        r.raise_for_status()
        s = slug(name)
        # keep the raw download for reference
        with open(os.path.join(RAW_DIR, f"{s}.jpg"), "wb") as f:
            f.write(r.content)
        # square-crop + optimize into the site
        im = ImageOps.exif_transpose(Image.open(BytesIO(r.content))).convert("RGB")
        im = ImageOps.fit(im, (SIZE, SIZE), Image.LANCZOS, centering=(0.5, 0.4))
        out = os.path.join(OUT_DIR, f"{s}.jpg")
        im.save(out, "JPEG", quality=QUALITY, optimize=True, progressive=True)
        kb = os.path.getsize(out) // 1024
        print(f"  {name:12s} -> images/stylists/{s}.jpg  ({kb} KB)")
    except Exception as e:
        print(f"  {name:12s} FAILED: {e}")

print(f"\nDone -> {OUT_DIR}")
