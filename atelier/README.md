# ATELIER - architecture practice template

An architecture studio presented as a set of drawing sheets: chalk, charcoal, concrete and a drafting-red accent. Part of the Studio Templates collection - see the root `README.md` for the full guide.

```bash
npm install
npm run dev      # http://localhost:3003
npm run build && npm start
```

**Sections:** Practice-profile hero with crop marks and a dimension line; Project index - featured plates + catalogue table + full project sheets; Details - mounted prints with typology filter and viewer; The practice - process plates and a schedule-of-services table; Pinned note on method; Client notes; Project brief form (demo); Title-block footer.

**Type:** Instrument Sans (width axis), Fragment Mono. Colours, fonts and easing live in the `@theme` block of `app/globals.css`.

**Edit content in** `lib/site.ts` (business details, nav, socials) and `lib/content.ts` (all copy and data). Images are in `public/images/`.

Project data (number, typology, status, area) is in `lib/content.ts` and feeds both the index table and the project sheets.

All business details, prices, testimonials and metrics are fictional demo content. Forms simulate success locally and send nothing.
