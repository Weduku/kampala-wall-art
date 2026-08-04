# Kampala Wall Art — Mural & Graffiti Map

A free, single-file web app. No build tools, no server, no billing account needed.

## What's inside
- `index.html` — the whole app (map, icons, popups, routing). Open it directly in a browser to test.
- `manifest.json` + `sw.js` — make the app installable on phones (see "Install on a phone" below).
- `icon-192.png` / `icon-512.png` — app icon shown on the home screen once installed.
- `images/` — put your mural photos here.

## How it works
- **Map tiles**: Google Hybrid (satellite + labels), no API key needed.
- **Routing**: free public OSRM server, walking directions from the visitor's current location to the selected mural. No API key required.
- **Data**: sites are loaded live from a published Google Sheet (as CSV) — see "Adding murals" below.

## Adding murals — no code editing required

Mural data now lives in a **Google Sheet**, not in the code. Once it's set up (one-time), adding a new mural is just adding a row.

### One-time setup

1. **Create the sheet.** In Google Sheets, make a new sheet with exactly these column headers in row 1 (any order, but spelled exactly like this):

   | name | artist | lat | lng | safety | description | photo | year | photo2 | year2 | photo3 | year3 | photo4 | year4 |
   |------|--------|-----|-----|--------|-------------|-------|------|--------|-------|--------|-------|--------|-------|

   - `safety` must be one of: `safe`, `day`, `unsafe`
   - `lat` / `lng`: right-click a spot in Google Maps, click the coordinates to copy
   - `photo`, `photo2`, `photo3`, `photo4`: up to 4 photos per site — each a filename (e.g. `mural-3.jpg`) or a full image URL. Leave later ones blank if a site has fewer photos; the app only shows however many are filled in.
   - `year`, `year2`, `year3`, `year4`: the year each matching photo was taken — shown as a white-on-black badge on the bottom-left of that photo. Leave blank to hide the badge for that photo.

   **Shortcut**: this project includes `starter-data.csv` with your existing two murals already filled in. In Google Sheets: **File → Import → Upload**, select that file, choose "Replace current sheet," and you're already set up with the right columns and both existing sites.

2. **Publish it as CSV.** In Google Sheets: **File → Share → Publish to web**. Under "Link," choose the specific sheet/tab, and under the format dropdown choose **Comma-separated values (.csv)**. Click **Publish**. Copy the link it gives you.

3. **Paste that link into the app — the one time you'll touch code.** Open `index.html`, search for:
   ```
   const SHEET_CSV_URL = "PASTE_YOUR_PUBLISHED_GOOGLE_SHEET_CSV_LINK_HERE";
   ```
   Replace the placeholder text (keeping the quotes) with your published link, save, and re-upload `index.html` to GitHub. This is a one-time step — after this, the app always pulls live from the sheet.

### From then on — adding a mural

1. Open your Google Sheet.
2. Add a new row with the mural's details.
3. Save (Sheets auto-saves).
4. Refresh the app — the new mural appears. No code, no GitHub, no re-uploading `index.html`.

> Google's published CSV can take a few minutes to reflect a fresh edit (it's cached briefly on their end) — if a new row doesn't show immediately, wait a minute and refresh again.

### Adding photos
Photos still need to be reachable at a URL. Two options:
- **Simplest**: drag the photo file into the `images/` folder in your GitHub repo (GitHub's website lets you drag-and-drop upload — no code, no terminal), then put that exact filename in the `photo` column.
- **Alternative**: host the photo anywhere else (Google Photos shared link, etc.) and put the full `https://...` URL in the `photo` column instead.

If a photo is missing or the filename doesn't match, the popup shows a placeholder automatically instead of breaking.

## Step A — Test locally
Just double-click `index.html` to open it in a browser. Geolocation (for routing) may be blocked on `file://` in some browsers — if "Get directions" doesn't work locally, that's expected; it will work once hosted (Step B).

## Step B — Publish for free on GitHub Pages
1. Create a new repository on your GitHub account, e.g. `kampala-wall-art`.
2. Upload `index.html`, `manifest.json`, `sw.js`, both icon files, and the `images/` folder to it (drag-and-drop works on github.com, or use `git push`).
3. Go to the repo's **Settings → Pages**.
4. Under "Source," choose the `main` branch and `/ (root)` folder, then save.
5. GitHub gives you a live URL after a minute or two, like:
   `https://your-username.github.io/kampala-wall-art/`

That's your live app — free hosting, free HTTPS, shareable link.

## Step C — Install it on a phone
Once it's live on GitHub Pages (installing only works over `https://`, not from a local file):

**Android (Chrome)**: open the link → tap the **⋮** menu → **"Add to Home screen"** / **"Install app"**. It gets its own icon and opens full-screen, like a real app.

**iPhone (Safari)**: open the link → tap the **Share** icon → **"Add to Home Screen"**. Same result.

No app store, no review process, no developer fee — this is what makes a PWA (Progressive Web App) the free path to something install-able. A "real" app-store app is a separate, bigger project (rebuilt in a mobile framework, plus a $25 one-time Google Play fee or $99/year Apple fee) — not needed unless you specifically want store listing/discovery later.

## Notes & options
- **Photo gallery**: each site can show up to 4 photos. In the popup, swipe (or use the arrow buttons) to scroll through them; dots show which photo you're on. Each photo's year appears as a white-on-black badge, bottom-left.
- **Routing**: "Drive + walk directions" is the default — it drives as far as a road reaches, then automatically switches to a walking leg (shown as a dashed teal line) if the site sits off-road, e.g. down a footpath or through an informal settlement. "Walking directions only" is also available as a second button for anyone who'd rather walk the whole way.
- **Basemap**: Google Hybrid (satellite + labels), pulled from Google's public tile endpoint. This works without any sign-up or billing, but it's an unofficial method (not the sanctioned Maps JavaScript API), so Google could change or block it without warning. If that ever happens, a solid free fallback is Esri's World Imagery hybrid basemap through your ArcGIS Online account.
- **Safety labels**: "Safe" (cyan, checkmark), "Safe during day time" (amber, sun), "Unsafe" (red, warning triangle) — shown as colored pin markers and in the legend top-right.
- **ArcGIS Online**: you don't need it for tiles/routing in this version. If later you want to manage site data through ArcGIS's dashboard instead of a Google Sheet, that's a reasonable v2 upgrade, but it adds complexity (API keys, credit budgeting) that isn't needed to get this working.
- **OSRM public server**: it's rate-limited and meant for light/demo use, which fits a personal project fine. If it ever feels slow or you want a dedicated routing backend, OpenRouteService offers a free API key with a much higher limit — happy to wire that in later if needed.

## If you get stuck
Come back with the error or what's not working — happy to debug specific pieces.
