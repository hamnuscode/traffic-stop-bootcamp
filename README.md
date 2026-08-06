# Traffic Stop Bootcamp

Marketing and training site for **Traffic Stop Bootcamp**, a program of Journey 2 Justice Learning LLC.

Hand-coded static site — three HTML pages, one stylesheet, two small scripts. No WordPress, no page builder, no build step. Open `index.html` in a browser and it runs.

```
index.html          Home — catch line + lead form, highlights video, anatomy of a stop, modules, audiences
modules.html        Training modules — password-protected, one row per module
contact.html        Contact details + message form
assets/css/site.css All styling. Tokens are at the top.
assets/js/site.js   Nav, scroll reveal, form submission. FORM_ENDPOINT lives here.
assets/js/gate.js   Modules password gate. PASSWORD_HASH lives here.
assets/img/logo.svg Placeholder logo — replace this file.
assets/video/       Drop the five video files here.
```

---

## Still to swap in

Everything below is marked with a comment in the code so it's easy to find.

### 1. Logo
Replace `assets/img/logo.svg` with the client's file, keeping the filename. If it's a PNG, change `logo.svg` to `logo.png` in the three page headers and in the `<link rel="icon">` tag.

### 2. Videos (5 total)
Put the files in `assets/video/`. In each page, find the `VIDEO SLOT` comment and replace the placeholder block with:

```html
<video controls playsinline preload="metadata" poster="assets/img/module-1-poster.jpg">
  <source src="assets/video/module-1.mp4" type="video/mp4">
</video>
```

A Vimeo or YouTube `<iframe>` drops into the same spot without any CSS changes. **Recommended:** host the module videos as unlisted Vimeo, so the files themselves are not publicly fetchable.

- Home: highlights video (`index.html`, section `#highlights`)
- Modules: four module videos (`modules.html`, one per `<article class="module">`)

### 3. Module descriptions and icons
`modules.html` — each module has a paragraph and a four-item `module__points` list, both written as placeholders pending the client's copy. The icon is an inline `<svg>` marked `ICON SLOT`; paste any 24×24 stroke icon in its place and it inherits the right colour and size automatically.

Current placeholder icons: stopwatch (01), two speech bubbles (02), descending chevrons settling to a line (03), document with a check (04).

### 4. Modules password
Default password is **`bootcamp2026`** — change it before launch.

```bash
printf '%s' 'your-new-password' | shasum -a 256
```

Paste the hex string into `PASSWORD_HASH` at the top of `assets/js/gate.js`. The plain password never appears in the source.

**What this gate is:** a front-end lock that keeps the page out of casual reach and out of search results (`noindex` is set). **What it is not:** server-side security. If real access control is needed, either turn on HTTP Basic Auth at the host or use unlisted Vimeo URLs — both are noted in the comments at the top of `gate.js`.

### 5. Form delivery
Both forms post to FormSubmit, which relays to `David@TSBootcamp.com`. It needs one activation step:

1. Deploy the site.
2. Submit either form once from the live URL.
3. FormSubmit emails David a confirmation link — click it.
4. Submissions arrive from then on.

To use a different service, change the single `FORM_ENDPOINT` string at the top of `assets/js/site.js`. If a submission ever fails, the form shows the direct email address rather than a dead end.

### 6. Contact details
`contact.html` and the three footers carry placeholder name, phone, and address. Real values go in `.contact-card` and the `.detail-list` block.

---

## Design notes

The palette and structure come from roadway signage rather than a generic template:

| Token | Value | Role |
|---|---|---|
| `--sign` | `#0B5B45` | Guide-sign green — brand anchor |
| `--ink` | `#0E1C24` | Petrol ink — text and dark bands |
| `--hazard` | `#E6A93B` | Hazard amber — tick marks and focus rings only |
| `--sheeting` | `#EDF1EE` | Page ground — pale reflective sheeting |
| `--mist` | `#D6DDD8` | Hairlines and borders |

Type: **Newsreader** for headlines — an editorial serif with real optical sizing, set at light weights (450) with a true italic doing the emphasis, so headings read composed rather than shouted. **Instrument Sans** for body and interface. **IBM Plex Mono** only on measured things: time codes, module numbers, small data labels.

Nothing is set in an expanded width and almost nothing is uppercase, which is deliberate — the earlier draft was too heavy and read as blocky.

The recurring motif is the **tick rule** — the measured marks under the header and beside each timeline beat. It carries the site's one structural idea: a traffic stop is a sequence in time, and the four modules follow that sequence. That's why the modules are numbered — the order is information, not decoration.

Motion is deliberately restrained: one fade-and-lift as blocks enter, hover states on links and cards, nothing else. `prefers-reduced-motion` is respected throughout.

Accessibility: skip link, visible keyboard focus on every interactive element, labelled form fields, live-region form status, semantic headings, and a mobile nav that closes on Escape.

---

## Running locally

Any static server works. The password gate needs `https` or `localhost` (it uses the Web Crypto API):

```bash
cd traffic-stop-bootcamp
python3 -m http.server 8000
# → http://localhost:8000
```

## Deploying

The site is static, so any host serves it. It currently deploys to Vercel — pushing to `main` publishes automatically.
