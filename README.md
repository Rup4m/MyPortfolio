# Rupam Debnath — Design × Code Portfolio

A premium, editorial portfolio for a graphic designer and web developer.
Home page flow: full-screen portrait hero → about → **cinematic paint-burst transition** into the design showcase (graphic + UI design) → circle-wipe into **development** → toolbox → **CV** (download / view) → **services** with WhatsApp ordering → contact form + socials.
A second page, **All works** (`works.html`), lists every project with filters for Graphic design / UI design / Coding.

Everything is built with plain **HTML, CSS and vanilla JavaScript**. There are no frameworks, no build step and no npm packages.

---

## Run it

The site can't run by double-clicking `index.html`; it has to be opened through a local web server.

```bash
# any one of these, from inside the project folder
python -m http.server 8000        # then open http://localhost:8000
npx serve .                       # Node
# or the "Live Server" extension in VS Code
```

## Folder structure

```
rupam-portfolio/
├── index.html                  # home page
├── works.html                  # All works page (filters: design / UI / coding)
├── 404.html                    # custom "page not found"
├── README.md
└── assets/
    ├── css/
    │   ├── base.css            # design tokens (colours, fonts, sizes), reset, utilities
    │   ├── components.css      # preloader, header, menu, buttons, cursor, marquee, lightbox, reveal system
    │   ├── sections.css        # hero, intro, work (design → switch → development), toolbox, contact, footer
    │   ├── works.css           # All works page
    │   └── responsive.css      # every screen: phones, tablets, laptops, 2K / 4K
    ├── js/
    │   ├── config.js           # ⭐ your email, WhatsApp, socials, CV path
    │   ├── data/projects.js    # ⭐ every project on the All works page
    │   ├── works.js            # All works page: filters, grid/list, hover preview
    │   ├── design-intro.js     # paint-burst + zoom transition into the design section
    │   ├── contact.js          # wires config into links; WhatsApp/email project form
    │   ├── page-transition.js  # curtain between Home and All works
    │   ├── theme.js            # light / dark mode switch (remembered per device)
    │   ├── utils.js            # RD namespace, helpers, one shared requestAnimationFrame ticker
    │   ├── smooth-scroll.js    # inertia scrolling (Lenis-style), anchor links, scroll lock
    │   ├── split-text.js       # splits headings into words for reveals
    │   ├── reveal.js           # adds .is-inview when elements enter the viewport
    │   ├── scroll-effects.js   # parallax, image drift, velocity marquees, scrubbed text,
    │   │                       #   the design→code switch, "Now viewing" counters, light/dark UI
    │   ├── hero-canvas.js      # animated paint-colour background + flowing line mesh
    │   ├── cursor.js           # custom cursor with labels ("View", "Open", "Visit")
    │   ├── magnetic.js         # buttons that lean toward the cursor
    │   ├── menu.js             # slide-in navigation
    │   ├── lightbox.js         # full-screen viewer for design work
    │   ├── dev-cards.js        # 3D tilt + auto-scrolling website screenshots
    │   ├── code-typer.js       # typed, syntax-highlighted code snippet
    │   ├── clock.js            # live Bangladesh time in the footer
    │   ├── preloader.js        # greeting + counter + curtain reveal
    │   └── main.js             # boots every module (each isolated with try/catch)
    ├── cv/
    │   ├── Rupam-Debnath-CV.pdf               # placeholder — replace with your CV
    │   └── Rupam-Debnath-Design-Portfolio.pdf # compressed design portfolio (11 pages)
    ├── icons/
    │   ├── favicon.svg
    │   └── sprite.svg          # brand + UI icons (GitHub, LinkedIn, WhatsApp…)
    └── images/
        ├── hero/               # rupam-hero.webp/.jpg, rupam-avatar.jpg, og-image.jpg
        ├── work/               # real design work from the 2026 design portfolio + 00-design-reel.jpg
        └── code/               # project screenshots / previews + 00-code-reel.jpg
```

## ⭐ Your details — edit ONE file

Open **`assets/js/config.js`**. It controls every email link, WhatsApp button, social icon and CV button on both pages:

```js
email: 'rupamdebnath.cse@gmail.com',
whatsapp: '8801307521491', // already set (01307521491)
cv: 'assets/cv/Rupam-Debnath-CV.pdf',
socials: { github: '…/Rup4m', instagram: '…', facebook: '…', x: '…', linkedin: '', behance: '', dribbble: '' }
```

A social left as `''` shows its logo greyed out with "soon". Paste the URL and it goes live.

**CV:** replace `assets/cv/Rupam-Debnath-CV.pdf` with your real CV (keep the file name). The CV section's timeline text is in `index.html` → `#cv`.

**All works page:** projects are listed in `assets/js/data/projects.js`. Add an object there and it appears with the right filter automatically.

**Contact form:** it needs no server. "Send on WhatsApp" opens WhatsApp with the message pre-written; "Send by email" opens the visitor's mail app (after you add your email).

## Make it yours (checklist)

Where to change things:

| What | Where |
|---|---|
| LinkedIn / Behance / Dribbble | `assets/js/config.js` → `socials` |
| Design work | `assets/images/work/` + `index.html` (`.dproj` figures) + `assets/js/data/projects.js` |
| Website screenshots | `assets/images/code/`: tall full-page screenshots scroll inside the browser frame on hover |
| Project names, years, descriptions, tech chips | `index.html` → `.dproj` figures and `.dev-card` articles |
| Counters ("/ 06", "/ 04") | `index.html` → the two `.panel__now` blocks, if you change the number of projects |
| Typed code | `assets/js/code-typer.js` → `CODE` |
| Preloader words | `assets/js/preloader.js` → `WORDS` |

### Adding a design project
Copy one `<figure class="dproj" …>` block. Add `dproj--wide` for a full-width landscape image (16:10) or `dproj--offset` to push a portrait (4:5) image down for the staggered editorial layout. Update `data-title`, which is what the "Now viewing" panel displays.

### Adding a development project
Copy one `<article class="dev-card" …>` block and change the preview image, URL bar text, title, description, chips and links.

## Dark mode

The switch sits in the header and in the mobile menu. The choice is saved on the visitor's device. The photo hero always stays light; every other section flips. Dark colours are set in `components.css`, under `html.theme-dark`.

## Design system

- **Colours:** paper `#f4f3ef`, ink `#141517`, dark `#0f1012`. Accents come from the paint strokes in the portrait: yellow `#f4b400`, red `#e8483b`, teal `#14a39a`. Design sections use warm accents and development sections use teal.
- **Type:** Syne (display), Manrope (body), JetBrains Mono (code), all from Google Fonts with system fallbacks.
- **Motion:** custom easing tokens in `base.css` (`--ease-out`, `--ease-in-out`). The animations respect `prefers-reduced-motion`.

## Accessibility & performance

- Semantic landmarks, a skip link, alt text, visible focus states, keyboard support for the menu and lightbox (with a focus trap), and `aria-live` counters.
- Pinch-zoom is **not** disabled.
- Smooth scrolling only runs on mouse/trackpad devices, so touch screens keep native scrolling. The page also works fully without JavaScript.
- Images below the hero use lazy loading. The hero canvas pauses when off-screen, and all scroll work shares one animation frame (reads first, then writes).

## Credits

Brand logos come from Simple Icons (CC0) and Font Awesome Brands (CC BY 4.0). Interface icons come from Material Design Icons (Apache 2.0). All of them are bundled in `assets/icons/sprite.svg`.

## Deploy

- **GitHub Pages:** push the folder to a repo, open Settings → Pages, and deploy from the `main` branch root.
- **Netlify / Vercel:** drag and drop the folder, or import the repo. No build command is needed.
