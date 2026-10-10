# Studio Templates

Four complete website demos plus a studio homepage that presents them to clients.
Each folder is an **independent Next.js project**: its own dependencies, its own
deployment and its own URL. You can copy one folder out and hand it to a client
without touching the others.

| Folder      | Site            | Industry                    | Local URL             |
| ----------- | --------------- | --------------------------- | --------------------- |
| `showcase/` | Ranvir Kawatra  | Your portfolio homepage     | http://localhost:3000 |
| `noir/`     | NOIR            | Café & hospitality          | http://localhost:3001 |
| `vanta/`    | VANTA           | Fashion & retail            | http://localhost:3002 |
| `atelier/`  | ATELIER         | Architecture & real estate  | http://localhost:3003 |
| `nova/`     | NOVA            | Creative & digital agency   | http://localhost:3004 |

## Run it locally

Requires Node.js 20.9 or newer.

```bash
npm run install:all   # npm install in every project (first time only)
npm run dev:all       # starts all five sites on ports 3000–3004
```

Open http://localhost:3000. The "Explore website" buttons open each demo.
To work on a single site, run its own scripts: `cd noir && npm run dev`.

Other helpers: `npm run build:all` (production build of everything) and
`npm run lint:all`.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · GSAP 3.15
(ScrollTrigger, SplitText, ScrambleText, DrawSVG) · Motion (Framer Motion) ·
Lenis smooth scrolling · Lucide icons. No 3D libraries — NOVA's interactive hero is a plain 2D canvas.

All animation respects `prefers-reduced-motion`. Smooth scrolling, parallax,
the NOVA dot field and scroll-pinned sections all switch to static versions, and content
appears immediately.

## Customising a template for a client

Every project follows the same layout:

```
<site>/
├─ app/
│  ├─ layout.tsx            fonts + SEO/Open Graph metadata
│  ├─ page.tsx              section order
│  ├─ globals.css           brand colours, fonts and easing tokens (@theme)
│  ├─ icon.svg              favicon / brand mark
│  └─ opengraph-image.tsx   social share image (generated)
├─ lib/
│  ├─ site.ts               ← business name, contact details, nav, socials
│  └─ content.ts            ← all copy, products, prices, projects, testimonials
├─ components/sections/     one file per page section
└─ public/images/           photography
```

1. **Text and data:** edit `lib/site.ts` and `lib/content.ts`. Nothing is hard-coded elsewhere.
2. **Photos:** replace files in `public/images/` (keep the names, or update the imports in `content.ts`).
3. **Colours and fonts:** change the `@theme` block in `app/globals.css` and the `next/font` imports in `app/layout.tsx`.
4. **Sections:** reorder or remove them in `app/page.tsx`.

The showcase is configured entirely in `showcase/lib/site.ts`: studio name,
email, the "Let's Talk" destination, socials, and the demo descriptions.

## Deploying (Vercel)

Each folder deploys as its **own Vercel project**:

1. Push this folder to a GitHub repository.
2. In Vercel, choose **Add New → Project**, import the repo, and set **Root Directory**
   to `noir`. Deploy. Repeat for `vanta`, `atelier` and `nova`.
3. Import the repo once more with Root Directory `showcase`, and add these
   environment variables (see `showcase/.env.example`):
   - `NEXT_PUBLIC_NOIR_URL`, `NEXT_PUBLIC_VANTA_URL`, `NEXT_PUBLIC_ATELIER_URL`, `NEXT_PUBLIC_NOVA_URL`: the four demo URLs from step 2
   - `NEXT_PUBLIC_SITE_URL`: the showcase's own URL
   - `NEXT_PUBLIC_CONTACT_URL`: optional; a `mailto:` or booking link for "Let's Talk"
4. Redeploy the showcase so it picks up the variables.

Any host that runs `next build && next start` works the same way.

## Keeping the showcase previews accurate

The previews on the homepage are real screenshots of the demos. After you change
a demo, start all sites and run:

```bash
npx --yes playwright@1 install chromium   # first time only
node scripts/capture-previews.mjs
```

## Content and image notes

- All four brands, their addresses, prices, testimonials and metrics are
  **fictional demo content**, and each site labels it as such.
- Forms validate input and show success states, but **nothing is sent anywhere**.
  To connect a real backend (Formspree, Resend, a CRM), replace the `setTimeout`
  in each form's `submit` handler.
- Photography is from [Unsplash](https://unsplash.com) under the
  [Unsplash License](https://unsplash.com/license) (free for commercial use, no
  attribution required). Swap in the client's own photos before launch.
