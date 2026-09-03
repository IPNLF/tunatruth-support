# TunaTruth Support — donation landing page

Status: **MVP scaffold, not production-ready.** Built for the Bangkok
industry screening deadline. Contains clearly-marked content placeholders
and a placeholder Stripe link — see "Open dependencies" below before
treating this as launch-ready.

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
assets/img/                  favicon, OG image (placeholder), assets
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

## Open dependencies (do not launch without these)

**Blocking — I cannot proceed on my own:**
- Stripe account access (or someone at IPNLF creating the Payment Link
  from the spec above) — I have not created any Stripe account, per the
  "no account creation" rule, and none of the payment flow below has
  actually been exercised end-to-end yet.
- Legal entity receiving funds, and settlement currency (the config
  currently assumes USD as a placeholder — unconfirmed).
- Confirmation that a single "customer chooses amount" Payment Link is
  acceptable, vs. fixed preset-amount links (see above).

**Resolved from real supplied assets (no longer placeholder):**
- IPNLF's and TunaTruth's actual logos (`assets/img/ipnlf-logo.png`,
  `assets/img/tunatruth-logo.png`) — real files, not recreated/guessed.
- Hero background photo (`assets/img/hero-photo.jpg`) and the OG
  social-share image (`assets/img/og-image.jpg`, cropped from the real
  poster) are genuine TunaTruth production stills, not stock photography.
- The "Behind the film" section's production credit (Sunline Films,
  IPNLF as executive producer, presenter Serena Appleby, director Sara
  Pipernos, supporting orgs) is copied directly from the official poster
  asset — factual, not invented.

**Content — still placeholder text, marked `[PLACEHOLDER — ...]`
directly in the page:**
- One-sentence description of TunaTruth (hero support line)
- 50–100 word synopsis ("What TunaTruth is")
- What additional funding specifically enables ("What your support helps
  achieve") — no invented figures
- Why-now / Bangkok screening context
- A sentence or two on why IPNLF backs this specific film (beyond the
  factual production credit already in place)
- TunaTruth site/socials link
- Confirmation-page copy tone
- Privacy policy, refund/contact information, receiving-entity legal name
  (footer) — note this may differ from the production companies credited
  above; it's whichever entity actually receives the Stripe funds
- Final suggested donation amounts (currently $25/$50/$100, explicitly
  marked "provisional" on the page)
- Preferred settlement/display currency if not USD

**Domain:**
- `SITE_CONFIG.canonicalUrl` (in `assets/js/config.js`) **and** the
  `og:url`/`og:image` meta tags in `index.html` (static, not config-driven,
  since Open Graph tags must be readable without JS) all point at a
  placeholder `tunatruth-support.netlify.app` URL — update all three in
  the same pass. Then re-run `scripts/generate_qr.py` once a final domain
  (ideally a branded IPNLF/TunaTruth one for Bangkok, Netlify subdomain as
  fallback) is confirmed. Do this *after* the domain is final — the
  QR/URL should not change once distributed.

## Known / Assumption / Recommendation

- **Known:** the Bangkok deadline and the flow (landing → amount →
  Stripe → thank-you) requested.
- **Assumption:** USD as settlement currency; Netlify subdomain acceptable
  as a fallback if a custom domain isn't ready in time; single "customer
  chooses amount" Payment Link is an acceptable donation mechanism.
- **Recommendation:** confirm the Stripe donation-price approach above
  before assuming per-amount fixed links; get real hero imagery/synopsis
  copy moving in parallel with Stripe setup, since neither blocks the
  other and both are currently the tightest parts of the critical path.

## Not done yet (see chat report for full verification status)

Production Stripe flow, final content, custom domain, and a real QR
destination test are all outstanding — see the readiness table in the
chat reply for exactly what has and hasn't been checked.
