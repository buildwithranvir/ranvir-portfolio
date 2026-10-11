# ranvir-portfolio

The code behind **[buildwithranvir.vercel.app](https://buildwithranvir.vercel.app)**, the portfolio of Ranvir Kawatra, a creative web developer in Delhi, plus **[templatesbyranvir.vercel.app](https://templatesbyranvir.vercel.app)**, where clients pick a template, and the concept websites both of them present.

Each folder is an independent Next.js project with its own dependencies and its own Vercel deployment.

| Folder | What it is | Live |
| --- | --- | --- |
| `showcase/` | The portfolio | https://buildwithranvir.vercel.app |
| `catalogue/` | Ranvir's Templates, the template shop | https://templatesbyranvir.vercel.app |
| `noir/` | NOIR, a café and bakery concept | https://noir-green-psi.vercel.app |
| `vanta/` | VANTA, a fashion studio concept | https://vanta-chi-two.vercel.app |
| `atelier/` | ATELIER, an architecture practice concept | https://atelier-pi-beige.vercel.app |
| `nova/` | NOVA, a creative technology studio concept | https://nova-phi-blue.vercel.app |

NOIR, VANTA, ATELIER and NOVA are fictional brands, designed and built as website concepts. Their names, prices and testimonials are invented, and their forms send nothing.

## Run it locally

Requires Node.js 20.9 or newer.

```bash
npm run install:all   # npm install in every project (first time only)
npm run dev:all       # all sites on ports 3000 to 3005
```

To work on one site: `cd noir && npm run dev`. Also available: `npm run build:all` and `npm run lint:all`.

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, GSAP 3 (ScrollTrigger, SplitText, Flip, ScrambleText), Motion and Lenis. Every animation respects `prefers-reduced-motion`.

## Deploying

Each folder is its own Vercel project, connected to this repository with its folder as the Root Directory. A push to `main` rebuilds only the projects whose folder changed (each project's Ignored Build Step runs `git diff --quiet HEAD^ HEAD -- .`).

The portfolio reads the concept-site URLs from `NEXT_PUBLIC_NOIR_URL`, `NEXT_PUBLIC_VANTA_URL`, `NEXT_PUBLIC_ATELIER_URL` and `NEXT_PUBLIC_NOVA_URL`, which are set in its Vercel project.

## Adding a template to the shop

1. Deploy the new template, then capture its previews: `npm install` (first time only), then `npm run capture -- <id> <live-url>`.
2. Add its entry to `catalogue/lib/templates.ts`.
3. Push to `main`.

Full details are in `catalogue/README.md`.

## Previews

The screenshots on the portfolio are real captures of the concept sites. After changing one, start all sites and run:

```bash
npx --yes playwright@1 install chromium   # first time only
node scripts/capture-previews.mjs
```

Photography in the concept sites is from [Unsplash](https://unsplash.com) under the [Unsplash License](https://unsplash.com/license).
