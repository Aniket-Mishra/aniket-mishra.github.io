"""Build the blog.

Reads every Markdown file in posts/, converts it to a styled HTML page in
blog/, and writes blog/posts.json so the blog index can list everything.

Each post starts with a small header block fenced by triple dashes:

    ---
    title: Why Continual Learning Is Hard
    date: 2026-05-30
    summary: A short line shown on the blog index.
    ---

    Your post body in Markdown goes here.

Run it from the project root:

    python build.py

GitHub Pages does not run this for you. Build first, then commit and push.
"""

from pathlib import Path
from datetime import date
import json
import re
import sys

try:
    import markdown
except ImportError:
    print("The 'markdown' package is missing. Install it with:")
    print("    pip install markdown")
    sys.exit(1)

ROOT = Path(__file__).parent
POSTS_DIR = ROOT / "posts"
BLOG_DIR = ROOT / "blog"
TEMPLATE_PATH = BLOG_DIR / "post-template.html"


def read_front_matter(text):
    """Split a post into its header fields and its Markdown body."""
    if not text.startswith("---"):
        raise ValueError("Post is missing the '---' header block.")

    _, header, body = text.split("---", 2)

    fields = {}
    for line in header.strip().splitlines():
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        fields[key.strip()] = value.strip()

    return fields, body.strip()


def slug_from_filename(path):
    """Use the file name as the URL slug, lowercased and dash separated."""
    return path.stem.lower().replace(" ", "-").replace("_", "-")


def format_display_date(raw_date):
    """Turn 2026-05-30 into a readable 'May 30, 2026'."""
    parsed = date.fromisoformat(raw_date)
    return parsed.strftime("%B %-d, %Y")


def build_post_page(fields, body_html, template):
    """Fill the template with one post's title, date, and body."""
    page = template.replace("{{title}}", fields["title"])
    page = page.replace("{{date}}", fields["display_date"])
    page = page.replace("{{summary}}", fields.get("summary", ""))
    page = page.replace("{{body}}", body_html)
    return page


def collect_posts(template):
    """Convert every Markdown file and return their index entries."""
    converter = markdown.Markdown(extensions=["fenced_code", "tables"])
    entries = []

    for path in sorted(POSTS_DIR.glob("*.md")):
        fields, body = read_front_matter(path.read_text(encoding="utf-8"))
        fields["display_date"] = format_display_date(fields["date"])

        body_html = converter.convert(body)
        converter.reset()

        slug = slug_from_filename(path)
        page = build_post_page(fields, body_html, template)
        (BLOG_DIR / f"{slug}.html").write_text(page, encoding="utf-8")

        entries.append({
            "title": fields["title"],
            "summary": fields.get("summary", ""),
            "date": fields["date"],
            "displayDate": fields["display_date"],
            "slug": slug,
        })
        print(f"Built {slug}.html")

    entries.sort(key=lambda entry: entry["date"], reverse=True)
    return entries


def main():
    if not TEMPLATE_PATH.exists():
        print("Missing blog/post-template.html.")
        sys.exit(1)

    template = TEMPLATE_PATH.read_text(encoding="utf-8")
    entries = collect_posts(template)

    index_path = BLOG_DIR / "posts.json"
    index_path.write_text(json.dumps(entries, indent=2), encoding="utf-8")
    print(f"Wrote {len(entries)} post(s) to posts.json")


if __name__ == "__main__":
    main()
