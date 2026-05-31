# aniket-mishra.github.io

Personal site and blog. Plain HTML, CSS, and JavaScript. A Python script builds the blog from Markdown.

## Editing content

All content is in `js/data.js`: pitch, experience, projects, skills, recommendations. The HTML files are empty shells with mount points; scripts in `js/` read `data.js` and fill them.

- `data.js` content
- `shared.js` header, footer, radar, helpers
- `home.js` `experience.js` `research.js` `projects.js` one per page
- `theme.js` light/dark toggle
- `blog/blog.js` blog list

## Running locally

Paths are root-absolute, so opening files directly will not load styles. Run a server from this folder:

    python -m http.server

Then open http://localhost:8000.

## Blog posts

Create `posts/name.md` starting with:

    ---
    title: Post Title
    date: 2026-06-15
    summary: One line for the blog list.
    ---

    Body in Markdown.

Then build (needs `pip install markdown` once):

    python build.py

`name.md` becomes `/blog/name.html`.

## Deploying

GitHub Pages does not run the build. Build first, then push:

    python build.py
    git add .
    git commit -m "update"
    git push

## Notes

- Theme: toggle top right, saved per browser, dark by default. Colors are in the `:root` and `[data-theme="dark"]` blocks in `css/style.css`.
- Number highlighting: metrics with a unit (98%, 5x, 3 months) get emphasized; plain years do not. Pattern is in `highlightStats` in `js/shared.js`.
- Projects: each has a `filter` matching a name in `projectFilters`. Add a tab by adding to that array.
- There is a cat in the console.