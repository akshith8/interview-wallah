# Interview Wallah (static)

Plain HTML, CSS and JavaScript static site with cross-document view transitions, scroll-driven animations, and canvas/SVG acoustic motion graphics. No build step or npm needed.

- `index.html` editorial landing page (split hero with interactive cadence preview, anatomy of an answer, prompt index linking into the studio, FAQ, early access form)
- `interview.html` Practice Studio (live voice waveform visualizer, prompt selector & custom prompts, live telemetry, redirects to `report.html` on analysis)
- `report.html` Delivery Report (animated score ring, WPM pace band needle, filler-highlighted transcript, coaching takeaways)
- `css/style.css` editorial stylesheet, cross-document view transitions, and scroll-driven animations
- `js/analyse.js` scoring and filler-word logic
- `js/script.js` waveform renderer, interactive SVG breakdown, Practice Studio, Report viewer, and contact form

Open `index.html` in Chrome or Edge, or serve the folder locally (e.g. `npx serve .` or `python3 -m http.server`).
The contact form posts to `API_BASE` at the top of `js/script.js` (default `http://localhost:8000/contact`).
