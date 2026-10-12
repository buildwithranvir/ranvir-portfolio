# Ranvir Kawatra · Portfolio

The portfolio of Ranvir Kawatra, a creative web developer in Delhi. Live at **https://buildwithranvir.vercel.app**.

It is a single page told like a short film: an opening title sequence, the services, concept sites shown in their own colours, live client work, the toolkit, the process and a contact section that builds a WhatsApp message for you.

The full overview, with screenshots, is in the [repository README](../README.md).

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

## Where things live

- `lib/site.ts`: every piece of copy and data (contact details, bio, services, client projects, tools, concept sites, section names). Edit this first.
- `components/scenes/`: one file per section of the page.
- `components/cine/`: the frame around the page (intro film, top bar, menus, light switch).
- `app/globals.css`: colours for both lighting modes, the section washes and the pencil marks.

The concept-site links come from environment variables (`NEXT_PUBLIC_NOIR_URL` and the rest, see `.env.example`). Locally they default to ports 3001 to 3004.

## Deploying

Pushing to `main` deploys to Vercel automatically (Root Directory: `showcase`). Preview images in `public/previews/` are real screenshots; re-capture them with `node ../scripts/capture-previews.mjs` after changing a concept site.
