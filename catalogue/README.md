# Ranvir's Templates

The site clients use to pick a template: **https://templatesbyranvir.vercel.app**

It is set up like a paint shop. Every template is a colour chip in a fan deck, and stepping into one floods the page in its colours, with the real site scrolling on a laptop and a phone.

## Run it

```bash
npm install
npm run dev      # http://localhost:3005
```

## Adding a template

1. Deploy the new template (its own folder and Vercel project), then capture its previews from the `TEMPLATES` folder:

   ```bash
   npm run capture -- <id> <live-url>
   # e.g. npm run capture -- noir https://noir-green-psi.vercel.app
   ```

   This saves four screenshots to `public/t/<id>/` and records their sizes in `lib/previews.json`.

2. Add an entry to `lib/templates.ts` (copy an existing one). `id` must match the capture id. Pick a `finish` name for its chip, its three room colours (`paint`, `bg`, `ink`) and its palette.

3. Push to `main`. Vercel deploys it.

The new template gets everything automatically: a chip in the deck, its own room with the colour flood, the laptop and phone previews, the live viewer, the WhatsApp message, a dot in the bottom bar and a chip in the finale.

## Where things live

- `lib/templates.ts`: every template (the only file to edit when adding one)
- `lib/site.ts`: contact details and the shop colours
- `components/`: one file per part of the page (Loader, Hero, Steps, Deck, Room, Flood, LiveViewer, Finale, Hud)
- `app/globals.css`: colours, type and the chip styles
