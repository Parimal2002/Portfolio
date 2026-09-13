# Parimal Chaudhari — Portfolio

A responsive, dependency-free portfolio for a Web Server Administrator at Tata Consultancy Services supporting the SBI client engagement.

## Preview

Open `index.html` directly in a modern browser. No build command is required.

For a local web-server preview, run this command inside the `mine_portfolio` folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Main files

- `index.html` — portfolio text and page structure
- `css/port.css` — responsive styles, themes and animation
- `js/meyawo.js` — navigation, theme switcher, project filters and visual interactions

## Quick edits

- Change contact and social links near the bottom of `index.html`.
- Add a project by copying one `<article class="project-card">` block.
- Use `data-category="operations"` or `data-category="development"` so project filters continue to work.
- Change the main colors in the `:root` variables at the top of `css/port.css`.

The older resume PDF remains in the project for safekeeping but is intentionally not linked because its student-era information is outdated.
