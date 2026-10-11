# Ranvir's Templates

The site clients use to pick a template: **https://templatesbyranvir.vercel.app**

A dark, single-page showcase: a hero window that cycles through every template, an index, one case-study section per template with the real site scrolling on a laptop and a phone, a live preview, and WhatsApp buttons that name the template.

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

2. Add an entry to `lib/templates.ts` (copy an existing one). `id` must match the capture id. Fill in its colours (`paint` is its accent) and its palette.

3. Push to `main`. Vercel deploys it.

The new template gets everything automatically: a slot in the hero window, a row in the index, its own section with the laptop and phone previews, the live preview and the WhatsApp message.

## Where things live

- `lib/templates.ts`: every template (the only file to edit when adding one)
- `lib/site.ts`: contact details and WhatsApp messages
- `components/`: one file per part of the page (Loader, Nav, Hero, Marquee, Index, Template, How, Contact, LiveViewer)
- `app/globals.css`: colours, type and button styles
