# Kampala Wall Art — Mural & Graffiti Map

A free, single-file web app. No build tools, no server, no billing account needed.

## What's inside
- `index.html` — the whole app (map, icons, popups, routing). Open it directly in a browser to test.
- `manifest.json` + `sw.js` — make the app installable on phones (see "Install on a phone" below).
- `icon-192.png` / `icon-512.png` — app icon shown on the home screen once installed.
- `images/` — put your mural photos here.

## How it works
- **Map tiles**: free CARTO dark-style OpenStreetMap tiles (no API key, no Google Maps billing).
- **Routing**: free public OSRM server, walking directions from the visitor's current location to the selected mural. No API key required.
- **Data**: all sites live in one JavaScript array near the top of `index.html` — no database needed.

## Step 1 — Add your real site data
Open `index.html`, find the `const sites = [...]` block near the top of the `<script>` section, and replace the 3 sample entries with your own. Each site looks like this:

```js
{
  id: 4,
  name: "Your Mural's Name",
  artist: "Artist Name",
  lat: 0.3321,       // latitude
  lng: 32.5901,      // longitude
  safety: "safe",    // "safe", "day", or "unsafe"
  photo: "your-photo-filename.jpg",
  description: "One or two sentences about the piece or the location."
}
```

**Getting coordinates**: open Google Maps, right-click the spot, and the lat/lng appears at the top of the menu — click it to copy.

## Step 2 — Add photos
Drop your photos into the `images/` folder, using the exact filenames you referenced in `photo:` above. Keep them reasonably small (under ~500KB each) so the map loads fast on mobile data — you can compress with [squoosh.app](https://squoosh.app) for free.

If a photo is missing, the popup shows a placeholder automatically instead of breaking.

## Step 3 — Test locally
Just double-click `index.html` to open it in a browser. Geolocation (for routing) may be blocked on `file://` in some browsers — if "Get directions" doesn't work locally, that's expected; it will work once hosted (Step 4).

## Step 4 — Publish for free on GitHub Pages
1. Create a new repository on your GitHub account, e.g. `kampala-wall-art`.
2. Upload `index.html` and the `images/` folder to it (drag-and-drop works on github.com, or use `git push`).
3. Go to the repo's **Settings → Pages**.
4. Under "Source," choose the `main` branch and `/ (root)` folder, then save.
5. GitHub gives you a live URL after a minute or two, like:
   `https://your-username.github.io/kampala-wall-art/`

That's your live app — free hosting, free HTTPS, shareable link.

## Step 5 — Install it on a phone
Once it's live on GitHub Pages (installing only works over `https://`, not from a local file):

**Android (Chrome)**: open the link → tap the **⋮** menu → **"Add to Home screen"** / **"Install app"**. It gets its own icon and opens full-screen, like a real app.

**iPhone (Safari)**: open the link → tap the **Share** icon → **"Add to Home Screen"**. Same result.
