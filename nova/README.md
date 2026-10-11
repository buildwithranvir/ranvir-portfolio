# NOVA - creative technology studio template

A studio site built like an instrument: graphite, cold glass panels and one signal orange. No WebGL - the hero is a lightweight 2D canvas. Part of the Studio Templates collection - see the root `README.md` for the full guide.

```bash
npm install
npm run dev      # http://localhost:3004
npm run build && npm start
```

**Sections:** Hero with cursor-reactive dot field and glass readouts; Selected work - stacked sticky case-study cards + modal; Capabilities - expanding glass columns; Method - sticky glass monitor following the steps; Numbers + quote ribbon (demo figures); Console-style contact form (demo); Status-bar footer.

**Type:** Bricolage Grotesque (width + optical size), JetBrains Mono. Colours, fonts and easing live in the `@theme` block of `app/globals.css`.

**Edit content in** `lib/site.ts` (business details, nav, socials) and `lib/content.ts` (all copy and data). Images are in `public/images/`.

The dot field is `components/DotField.tsx`; it pauses off-screen and renders static for reduced motion. The custom cursor only appears on mouse/trackpad devices.

All business details, prices, testimonials and metrics are fictional demo content. Forms simulate success locally and send nothing.
