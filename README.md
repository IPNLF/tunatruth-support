# TunaTruth Support — donation landing page

Status: **MVP, not production-ready.** Built for the Bangkok industry
screening deadline. The page now reads as finished — real logos, real
photo, and plausible holding copy throughout — but most of that copy is
still provisional and the Stripe link is still a placeholder. Holding
copy is marked with `<!-- HOLDING COPY -->` HTML comments in the source
(invisible on the page) rather than visible `[PLACEHOLDER]` brackets, so
the design can be judged as-if-finished. See "Content approval checklist"
below for exactly what still needs IPNLF/production sign-off before
anything here is genuinely launch-ready.

## What this is

A single donation landing page (`index.html`) plus a confirmation page
(`thank-you.html`). Flow: **landing page → choose an amount → Stripe →
payment → thank-you page.** No accounts, no database, no backend —
static HTML/CSS/JS, matching the approach used on other IPNLF micro-sites
(e.g. the decarbonisation prototype), reusing the IPNLF brand tokens but
with its own campaign-page layout, not a copy of that site's structure.

## How to run it locally

```bash
python3 -m http.server 8843
```
Then visit `http://localhost:8843/index.html`. (Needed because the page
loads `config.js`/`components.js` as separate scripts — some browsers
block that over a bare `file://` URL.)

## Structure

```
index.html          Donation landing page (donate panel above the fold)
thank-you.html       Static confirmation page (Stripe redirects here)
assets/css/tokens.css        Design tokens (brand colours, type, spacing)
assets/css/components.css    All component styling
assets/js/config.js          SINGLE source of truth: Stripe link, brand
                              hierarchy, preset amounts, canonical URL
assets/js/components.js      Page components (header, hero+donate panel,
                              info sections, share, footer)
assets/img/                  favicon, real logos/hero photo/OG image
assets/qr/                   generated QR code pointing at the page
scripts/generate_qr.py       regenerate the QR after the URL changes
netlify.toml                 Netlify publish + security headers
```

## Brand flip (IPNLF ⇄ TunaTruth)

The brief flagged that final billing (IPNLF-first vs TunaTruth-first) is
still being decided. To keep that reversible:

- `assets/js/config.js` → `SITE_CONFIG.brandOrder = { primary, secondary }`
  is the only place hierarchy is decided. `components.js`'s `brandLockup()`
  reads this to decide which wordmark is larger/first in the header.
- The hero (`heroDonate()`) currently gives TunaTruth the large title
  treatment (since it's the thing being funded) while the header gives
  IPNLF top billing (since IPNLF is the credible, trusted brand carrying
  the ask). This split — IPNLF as *header* identity, TunaTruth as *hero*
  identity — was a judgement call to satisfy "IPNLF-branded for now, but
  TunaTruth named prominently" without one brand disappearing. Flag if
  you'd rather the hero itself flip on `brandOrder` too; it's a small
  change once you tell me which look you actually want tested.
- Colours, logos and copy are not hard-wired to one brand elsewhere in the
  CSS/JS — there's no `if (brand === 'ipnlf')` scattered through the file.

## Stripe readiness — three separate states, don't conflate them

1. **Test payment flow working** — a Stripe TEST-mode Payment Link is
   wired in via `assets/js/config.js`, and the full flow (successful
   payment, declined payment, redirect to `thank-you.html`) has been
   verified. *(Not yet true — waiting on a test-mode link.)*
2. **Live Stripe account configured** — a live Payment Link exists,
   created inside the Stripe account of the entity that legally receives
   the funds (not a personal account). *(Not started — depends on IPNLF
   confirming that entity.)*
3. **Live payment flow verified** — a real transaction has actually been
   run through the live link and confirmed end to end. *(Not started.)*

`SITE_CONFIG.stripeMode` in `config.js` is a human-readable flag (not
used by any code logic) that names which of these states currently
applies — keep it updated as you progress so anyone reading the config
knows at a glance not to assume more readiness than actually exists.
Per instruction, this pass deliberately does **not** set up a live
Stripe account against a personal bank account — only test mode.

## Payment flow — how the Stripe link works here

**Recommendation, not yet confirmed with you:** rather than one Payment
Link per preset amount (four links to maintain, four places that can go
stale), this uses **one Payment Link** with Stripe's "customer chooses
the price" donation-price feature. The preset buttons on this page are a
visual nudge (they highlight a suggested amount) but the actual amount is
entered/confirmed on Stripe's own hosted page, which supports arbitrary
donor-chosen amounts with a minimum you set. This is simpler to maintain
and is exactly the workflow Stripe designed for donations. If you'd
rather each preset amount charge an exact fixed price with no adjustment,
say so — that needs one Payment Link per amount instead, which is more
setup and more to keep in sync, but is easy to switch to.

**To wire up the real link:**
1. In the Stripe account **belonging to the legal entity receiving the
   funds** (not a personal/test account of mine — I have not created or
   used any Stripe account for this), create a Product with a price set
   to "customer chooses the price" and a sensible minimum.
2. Create a Payment Link for it. Under "After payment", set the
   confirmation redirect to this site's `thank-you.html` URL.
3. Paste that Payment Link URL into `assets/js/config.js` →
   `stripePaymentLinkUrl`. That's the only file that needs to change.
4. Test in Stripe test mode first (see "Open dependencies" — I could not
   do this myself without account access).

## Supporter rewards — design note (not implemented)

Rewards at donation levels (behind-the-scenes material, a director
message, Q&A access, credits, etc.) are under consideration but **not
confirmed**, so nothing reward-related is built yet — this is only an
assessment of how the existing donation component could take them on
later without the ecommerce-table feel the brief wants to avoid.

The current markup already fits the preferred pattern (amount stays
primary; a reward is a one-line reveal under the selected amount, not a
table above the fold):

- `amountPicker()` in `components.js` already renders each preset as a
  `<button data-amount="{n}">` — adding a reward per amount is just a
  data attribute (e.g. `data-reward="..."`) plus a single `<p>` inside
  `.tt-donate-panel` that `initInteractions()`'s existing click handler
  updates to show that amount's reward line. No new component, no
  layout change, and the panel doesn't grow — the reward line replaces
  itself as the selection changes rather than stacking a table of four.
- This keeps the donate panel exactly as visually dominant as it is now
  — the reward is a supporting detail inside the same card, not a
  competing block that pushes the CTA down.
- Risk to watch when real copy arrives: keep each reward line to one
  short sentence (as in the brief's own example, `$50 — Film Supporter,
  Includes [reward to be confirmed]`) — a longer per-amount description
  would start pushing the "Donate now" button down inside the panel on
  mobile, which is exactly the regression to avoid.

I'd recommend building this for real once amounts, names and reward
content are confirmed together — building it against provisional names
risks a rework if the confirmed tiers don't map cleanly onto the current
$25/$50/$100 buttons.

## Content approval checklist

Everything below reads as normal page copy (no visible brackets), but is
marked `<!-- HOLDING COPY -->` in the source and must be approved or
replaced before this page is genuinely launch-ready. Locations reference
`assets/js/components.js` unless stated otherwise.

| Item | Location | Status |
|---|---|---|
| Hero support line ("Support the next stage of...") | `heroDonate()` | Holding copy — needs approval |
| "What The Tuna Truth is" synopsis | `whatAndWhy()` | Holding copy — **needs fact-check**, written without seeing the film |
| "What your support helps achieve" | `whatAndWhy()` | Holding copy — provisional until production confirms actual use of funds |
| "Why now" | `whatAndWhy()` | Holding copy — deliberately not tied to Bangkok so it doesn't need rewriting once that date passes |
| "IPNLF supports The Tuna Truth..." sentence | `credibility()` | Holding copy — needs IPNLF approval specifically |
| Thank-you page body copy | `thank-you.html` | Holding copy — needs approval |
| Suggested donation amounts ($25/$50/$100) | `config.js` → `presetAmounts` | Explicitly labelled "provisional" on-page; real amounts TBC |
| Settlement currency (USD assumed) | `config.js` → `currencyCode` | Unconfirmed |
| Privacy policy / Contact & refunds links | `footer()` | Labels only — both point to `#`, no real page/address yet |
| Receiving legal entity name | `footer()` copyright line | Deliberately omitted — do not add a name without IPNLF sign-off (see Stripe section: may not be the same entity as the production credit) |
| TunaTruth site/socials link | `credibility()` | Removed for now (was a dead placeholder link) — add once supplied |

**Already resolved with real, supplied material (not holding copy):**
- IPNLF's and The Tuna Truth's actual logos (`assets/img/ipnlf-logo.png`,
  `assets/img/tunatruth-logo.png`).
- Hero background photo (`assets/img/hero-photo.jpg`) and the OG
  social-share image (`assets/img/og-image.jpg`, cropped from the real
  poster) — genuine production stills, not stock photography.
- The "Behind the film" production credit (Sunline Films, IPNLF as
  executive producer, presenter Serena Appleby, director Sara Pipernos,
  supporting orgs) — copied directly from the official poster asset.

## Hard external dependencies

- **Stripe** — see "Stripe readiness" above; blocked on a test-mode link
  today, and on IPNLF confirming the receiving entity for anything live.
- **Netlify deployment** — needs your own login/OAuth grant; see
  "Deployment" below.
- **Final domain** — `SITE_CONFIG.canonicalUrl` (in `assets/js/config.js`)
  **and** the `og:url`/`og:image` meta tags in `index.html` (static, not
  config-driven, since Open Graph tags must be readable without JS) all
  point at a placeholder `tunatruth-support.netlify.app` URL — update all
  three in the same pass, then re-run `scripts/generate_qr.py`. Do this
  *after* the domain is final — the QR/URL should not change once
  distributed.

## Known / Assumption / Recommendation

- **Known:** the Bangkok deadline; the flow (landing → amount → Stripe →
  thank-you); test mode only for today's Stripe pass, explicitly not a
  live setup against a personal bank account.
- **Assumption:** USD as settlement currency; Netlify subdomain acceptable
  as a fallback if a custom domain isn't ready in time; single "customer
  chooses amount" Payment Link is an acceptable donation mechanism.
- **Recommendation:** confirm the Stripe donation-price approach above
  before assuming per-amount fixed links; get the content-approval
  checklist moving in parallel with Stripe setup, since neither blocks
  the other.

## Not done yet (see chat report for full verification status)

A real Stripe link (test or live), Netlify deployment, final domain, a
real QR destination test, and every item in the content-approval
checklist are all outstanding — see the readiness table in the chat
reply for exactly what has and hasn't been checked.
