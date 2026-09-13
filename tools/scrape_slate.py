import os
import re
from urllib.parse import urljoin, urlparse
from collections import deque
import requests
from bs4 import BeautifulSoup
import html2text

START_URL = "https://www.slatestudioportland.com/"
TARGET_DOMAIN = "slatestudioportland.com"
OUTPUT_DIR = "./slate_markdown"
MAX_PAGES = 60

os.makedirs(OUTPUT_DIR, exist_ok=True)

h = html2text.HTML2Text()
h.ignore_links = False
h.ignore_images = False
h.ignore_tables = False
h.body_width = 0

UNWANTED_SELECTORS = [
    "header", "footer", "nav", "aside", "script", "style", "noscript", "iframe",
    ".header", ".footer", ".navigation", ".sidebar", ".menu", "#header", "#footer", "#nav"
]

queue = deque([START_URL])
visited = set()
headers = {"User-Agent": "Mozilla/5.0"}

def sanitize_filename(url):
    path = urlparse(url).path.strip("/")
    if not path or path in ("index.php", "index.html"):
        return "home.md"
    name = re.sub(r'[^a-zA-Z0-9_-]', '_', path)
    return f"{name}.md"

print(f"Starting extraction of {TARGET_DOMAIN} to '{OUTPUT_DIR}'...\n")

while queue and len(visited) < MAX_PAGES:
    current_url = queue.popleft()
    parsed_current = urlparse(current_url)
    clean_url = f"{parsed_current.scheme}://{parsed_current.netloc}{parsed_current.path}"

    if clean_url in visited:
        continue
    visited.add(clean_url)

    try:
        res = requests.get(current_url, headers=headers, timeout=8)
        if "text/html" not in res.headers.get("Content-Type", ""):
            continue

        soup = BeautifulSoup(res.text, "html.parser")
        link_soup = BeautifulSoup(res.text, "html.parser")

        for selector in UNWANTED_SELECTORS:
            for element in soup.select(selector):
                element.decompose()

        main_content = (
            soup.find("main")
            or soup.find("article")
            or soup.find("div", id=re.compile(r"content|main", re.I))
            or soup.find("div", class_=re.compile(r"content|main", re.I))
            or soup.body
        )

        if main_content:
            markdown_text = h.handle(str(main_content))
            page_title = soup.title.string.strip() if soup.title and soup.title.string else "Untitled Page"
            final_md = f"# {page_title}\n\n**Source:** {clean_url}\n\n---\n\n{markdown_text}"
            filename = sanitize_filename(clean_url)
            with open(os.path.join(OUTPUT_DIR, filename), "w", encoding="utf-8") as f:
                f.write(final_md)
            print(f"[{len(visited)}] Saved: {filename}")

        for a in link_soup.find_all("a", href=True):
            full_url = urljoin(current_url, a["href"].strip())
            parsed = urlparse(full_url)
            clean_link = f"{parsed.scheme}://{parsed.netloc}{parsed.path}"
            if TARGET_DOMAIN in parsed.netloc.lower() and clean_link not in visited:
                if not parsed.path.lower().endswith((".pdf", ".jpg", ".png", ".gif", ".zip", ".docx")):
                    queue.append(full_url)

    except Exception as e:
        print(f"Failed {clean_url}: {e}")

print(f"\nExtraction complete! Check '{OUTPUT_DIR}'.")
