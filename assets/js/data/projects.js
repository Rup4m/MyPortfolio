/* ==========================================================================
   projects.js — every project shown on the All Works page (works.html).
   Add a project by copying one object. Categories:
     'design' = graphic design   'ui' = UI / UX design   'code' = development
   (A filter with no projects hides itself automatically.)
   Design + UI items open in the full-screen viewer.
   Code items show tech tags and links (live / github — leave '' to hide).
   ========================================================================== */
window.RD_PROJECTS = [
  // ---------- Graphic design (from the 2026 design portfolio) ----------
  { cat: 'design', title: 'Uranus Gadgets', type: 'Instagram feed · Tech shop', year: 2025, img: 'assets/images/work/uranus-feed.jpg', shape: 'wide' },
  { cat: 'design', title: 'Uranus Gadgets', type: 'Feed mockup', year: 2025, img: 'assets/images/work/uranus-mockup.jpg' },
  { cat: 'design', title: 'Uranus Gadgets', type: 'Instagram stories', year: 2025, img: 'assets/images/work/uranus-stories.jpg', shape: 'wide' },
  { cat: 'design', title: 'Mono Skincare', type: 'Instagram feed · Skincare', year: 2025, img: 'assets/images/work/mono-feed.jpg', shape: 'wide' },
  { cat: 'design', title: 'Mono Skincare', type: 'Story mockup', year: 2025, img: 'assets/images/work/mono-mockup.jpg' },
  { cat: 'design', title: 'Mono Skincare', type: 'Instagram stories', year: 2025, img: 'assets/images/work/mono-stories.jpg', shape: 'wide' },
  { cat: 'design', title: 'bkry', type: 'Brand identity · Bakery', year: 2024, img: 'assets/images/work/bkry-identity.jpg', shape: 'wide' },
  { cat: 'design', title: 'bkry', type: 'Brand applications', year: 2024, img: 'assets/images/work/bkry-mockups.jpg', shape: 'wide' },
  { cat: 'design', title: 'bkry', type: 'Apron mockup', year: 2024, img: 'assets/images/work/bkry-bakery.jpg', shape: 'wide' },
  { cat: 'design', title: 'Marken', type: 'Logo & monogram pattern', year: 2024, img: 'assets/images/work/marken-identity.jpg', shape: 'wide' },
  { cat: 'design', title: 'Marken', type: 'Apparel mockup', year: 2024, img: 'assets/images/work/marken-apparel.jpg', shape: 'wide' },
  { cat: 'design', title: 'Marken', type: 'Signage', year: 2024, img: 'assets/images/work/marken-signage.jpg', shape: 'wide' },
  { cat: 'design', title: 'Marken', type: 'Packaging & tags', year: 2024, img: 'assets/images/work/marken-packaging.jpg', shape: 'wide' },

  // ---------- Development (github.com/Rup4m) ----------
  {
    cat: 'code', title: 'Rupam Earth Live', type: 'Web app · Weather radar', year: 2026,
    img: 'assets/images/code/earth-live.jpg', url: 'github.com/Rup4m/Rupam-Earth-Live-Weather',
    desc: 'Real-time planetary weather viewer inspired by Zoom Earth and Windy: live Doppler radar and satellite layers, a timeline player, wind-flow particles on canvas, city search and a click-anywhere weather inspector.',
    tech: ['JavaScript', 'Leaflet', 'Canvas', 'RainViewer', 'Open-Meteo'],
    live: '', github: 'https://github.com/Rup4m/Rupam-Earth-Live-Weather'
  },
  {
    cat: 'code', title: 'MovieVault', type: 'Web app · Movies', year: 2026,
    img: 'assets/images/code/movievault.jpg', url: 'github.com/Rup4m/MovieVault',
    desc: 'Discover trending movies, watch trailers and see ratings, then save films to a personal watch-later list.',
    tech: ['JavaScript', 'TMDB API', 'Supabase', 'YouTube'],
    live: '', github: 'https://github.com/Rup4m/MovieVault'
  },
  {
    cat: 'code', title: 'EduNest API', type: 'Backend · Team project', year: 2026,
    img: 'assets/images/code/edunest.jpg', url: 'github.com/Edu-NEST-API',
    desc: 'Course management REST API built by a team of four. I implemented the Category and Course modules: CRUD with validation, search, category filters and shared pagination.',
    tech: ['NestJS', 'TypeScript', 'PostgreSQL', 'TypeORM'],
    live: '', github: 'https://github.com/kamrulhassan017/Edu-NEST-API/pull/1'
  },
  {
    cat: 'code', title: 'Python Hand Tracker', type: 'Computer vision · Python', year: 2025,
    img: 'assets/images/code/hand.jpg', url: 'github.com/Rup4m/Python-Hand-tracker',
    desc: 'Real-time hand tracking from the webcam with 21 landmarks, which triggers a prank PC shutdown on one specific gesture.',
    tech: ['Python', 'OpenCV', 'MediaPipe'],
    live: '', github: 'https://github.com/Rup4m/Python-Hand-tracker'
  },
  {
    cat: 'code', title: 'WeatherDash', type: 'Web app · Weather', year: 2025,
    img: 'assets/images/code/weather-dash.jpg', url: 'github.com/Rup4m/WeatherAppby-Rupam',
    desc: 'A clean weather dashboard: search any city for temperature, humidity, wind, pressure, sunrise and sunset, plus a 5-day forecast.',
    tech: ['JavaScript', 'OpenWeatherMap', 'CSS'],
    live: '', github: 'https://github.com/Rup4m/WeatherAppby-Rupam'
  },
  {
    cat: 'code', title: 'Adv. WebTech Lab Tasks', type: 'Backend · Coursework', year: 2026,
    img: 'assets/images/code/labs.jpg', url: 'github.com/Rup4m/Adv.WebTech-Lab-Tasks-Fall26',
    desc: 'Three NestJS lab tasks that grow one API: a students CRUD, course management with DTOs, validation and Multer file uploads, then enrollment with notifications.',
    tech: ['NestJS', 'TypeScript', 'Multer', 'Postman'],
    live: '', github: 'https://github.com/Rup4m/Adv.WebTech-Lab-Tasks-Fall26'
  },
  {
    cat: 'code', title: 'Portfolio 2026 (v1)', type: 'Front-end · Personal', year: 2026,
    img: 'assets/images/code/portfolio-2026.jpg', url: 'github.com/Rup4m/My-Portfolio2026',
    desc: 'My first portfolio: a dark, cinematic one-pager with GSAP animation and a Three.js scene.',
    tech: ['HTML', 'CSS', 'GSAP', 'Three.js'],
    live: '', github: 'https://github.com/Rup4m/My-Portfolio2026'
  },
  {
    cat: 'code', title: 'Email Verify', type: 'Front-end · Form', year: 2025,
    img: 'assets/images/code/email-verify.jpg', url: 'github.com/Rup4m/Email-verify',
    desc: 'An order confirmation form that sends the customer an instant confirmation email straight from the browser.',
    tech: ['JavaScript', 'EmailJS', 'CSS'],
    live: '', github: 'https://github.com/Rup4m/Email-verify'
  }
];
