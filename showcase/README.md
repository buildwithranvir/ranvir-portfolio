# Showcase — Ranvir Kawatra's portfolio ("a film in eleven scenes")

Ranvir Kawatra's portfolio. Everything you'd change is in `lib/site.ts`: name, contact details, bio, services, projects, tools, socials and the demo cards.

```bash
npm install
npm run dev      # http://localhost:3000
```

Demo links default to `http://localhost:3001`–`3004`. In production, set the URLs through environment variables. Copy `.env.example` to `.env.local`, or add them in your host's dashboard.

Preview images in `public/previews/` are real screenshots. Re-capture them with `node ../scripts/capture-previews.mjs` after changing a demo.
