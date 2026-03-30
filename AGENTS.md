# AGENTS.md

## Cursor Cloud specific instructions

This is a zero-dependency static web application (HTML/CSS/JS) — no build step, no package manager, no backend.

### Running the app

Serve the files with any static HTTP server from the repo root:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/` in a browser.

### Lint / Test / Build

- **No linter, test framework, or build system** is configured. There is no `package.json`.
- Validation is manual: open the app in a browser, adjust sliders, and verify calculations update correctly.
- The app has two UI modes: "Jednoduchý režim" (simple) and "Pokročilý režim" (advanced). Click the mode switcher to toggle.

### Key files

| File | Purpose |
|---|---|
| `index.html` | Main HTML page |
| `script.js` | All calculator logic and UI sync |
| `styles.css` | All styling |
