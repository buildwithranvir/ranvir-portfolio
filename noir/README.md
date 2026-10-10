# NOIR — café & bakery template

A warm, tactile neighbourhood café: milk-paper background with grain, espresso ink, olive and burgundy, pencil-note handwriting and a frosted-glass nav. Part of the Studio Templates collection — see the root `README.md` for the full guide.

```bash
npm install
npm run dev      # http://localhost:3001
npm run build && npm start
```

**Sections:** Split editorial hero with a live 'today's special' note; A day at Noir — photo essay by time of day; This week's beans as kraft bag labels; Printed-menu card with folder tabs and staff annotations; The room — people, quotes, draggable photo strip; Visit — shopfront with glass opening-hours panel (today highlighted, open/closed status); Booking slip form (demo); Receipt footer.

**Type:** Gloock, Familjen Grotesk, Reenie Beanie. Colours, fonts and easing live in the `@theme` block of `app/globals.css`.

**Edit content in** `lib/site.ts` (business details, nav, socials) and `lib/content.ts` (all copy and data). Images are in `public/images/`.

Opening hours in `lib/site.ts` drive the live open/closed badge; daily specials live in `lib/content.ts`.

All business details, prices, testimonials and metrics are fictional demo content. Forms simulate success locally and send nothing.
