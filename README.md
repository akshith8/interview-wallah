# Interview Wallah (static)

Plain HTML, CSS and JavaScript version of the Next.js + Tailwind frontend. No build step or npm needed.

- `index.html` landing page (hero, about, practice demo, FAQ, contact form)
- `interview.html`, `report.html` placeholders (the originals were empty)
- `css/style.css` all styling (Tailwind utilities rewritten as normal CSS)
- `js/analyse.js` scoring and filler-word logic
- `js/script.js` page behaviour (marquee, recorder, feedback, contact form)

Open `index.html` in Chrome or Edge, or serve the folder (`python3 -m http.server`).
Voice recording needs Chrome/Edge; on `file://` the mic may prompt every time, so a local server is smoother.
The contact form posts to `API_BASE` at the top of `js/script.js` (default `http://localhost:8000/contact`).
