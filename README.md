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
assets/img/          Logo (placeholder), module stills, pilot seal.

```

---

## Still to swap in

Everything below is marked with a comment in the code so it's easy to find.

### 1. Logo
Replace `assets/img/logo.svg` with the client's file, keeping the filename. If it's a PNG, change `logo.svg` to `logo.png` in the three page headers and in the `<link rel="icon">` tag.

### 2. Videos — done
All five are live as `youtube-nocookie` embeds, lazy-loaded.

| Where | Video | ID |
|---|---|---|
| Home `#highlights` | Program preview (3–5 min) | `TdifiG6M3fw` |
| Modules 01 | The Ideal Traffic Stop | `EI_jgZyDTAo` |
| Modules 02 | Communication Skills | `qg_yQRKrRpA` (starts 0:39) |
| Modules 03 | Diffusing a High-Tension Situation | `cFBOkqANdOY` (starts 0:10) |
| Modules 04 | Replying to a Request to Search | `jVnONO_00xo` (starts 0:15) |

To change one, edit the `src` on that `<iframe>`. Nothing else moves.

**Worth knowing:** the module videos are public on YouTube, so the site's password gate hides the *page*, not the videos. Setting them to Unlisted in YouTube Studio would close that gap without touching the site.

### 3. Module descriptions and pictures — done
Descriptions are the client's own text, used as supplied. Icons are gone; each module now carries a photograph in the `PICTURE SLOT` — stills pulled from the videos themselves, plus the supplied de-escalation still on module 03. Swap any `<img src>` in `assets/img/` to change one.

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

### 6. Contact details — done
David Klepinger, Managing Partner, David@TSBootcamp.com, 770 656-1486. No physical address anywhere on the site, by request.

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

The **§** mark from the tagline repeats on the pilot offer — a statute glyph on a page about rights, doing the job a generic bullet would have done badly.

The other recurring motif is the **tick rule** — the measured marks under the header and beside each timeline beat. It carries the site's one structural idea: a traffic stop is a sequence in time, and the four modules follow that sequence. That's why the modules are numbered — the order is information, not decoration.

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
