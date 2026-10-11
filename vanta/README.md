# VANTA - fashion label template

A fashion label published as a magazine issue: warm grey stock, near-black ink and one ultramarine spot colour. Part of the Studio Templates collection - see the root `README.md` for the full guide.

```bash
npm install
npm run dev      # http://localhost:3002
npm run build && npm start
```

**Sections:** Issue cover with vertical title and table of contents; Hard Light - pinned horizontal campaign spread (swipe on mobile); The Edit - catalogue index with a viewing frame + product sheet; Letter from the studio - two-column feature with drop cap; Back issues - covers that filter the shop; Subscribe band; Colophon footer.

**Type:** Playfair (narrow axis), Libre Caslon Text, Schibsted Grotesk. Colours, fonts and easing live in the `@theme` block of `app/globals.css`.

**Edit content in** `lib/site.ts` (business details, nav, socials) and `lib/content.ts` (all copy and data). Images are in `public/images/`.

No cart or checkout: enquiries open the visitor's email with piece and size filled in. Photos use a muted house grade (`.grade` in globals.css).

All business details, prices, testimonials and metrics are fictional demo content. Forms simulate success locally and send nothing.
