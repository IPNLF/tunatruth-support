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

## Stripe readiness — four separate states, don't conflate them

1. **Test link wired in** — done. `assets/js/config.js` points at a real
   Stripe TEST-mode (Sandbox) Payment Link, supplied 2026-09-07.
2. **Test payment flow verified** — **done**, all three legs checked by
   hand against the real Stripe Sandbox checkout:
   - ✅ Successful payment: card `4242 4242 4242 4242` — went through.
   - ✅ Declined payment: card `4000 0000 0000 0002` — Stripe correctly
     showed *"Your credit card was declined. Try paying with a debit
     card instead"* inline, without losing the entered amount/email.
   - ✅ Redirect to `thank-you.html` — confirmed 2026-09-07 after you set
     "After payment" → "Redirect customers to your website" in the
     Payment Link's settings: a real test payment landed on our actual
     thank-you page (`tunatruthdonation.netlify.app/thank-you.html`),
     not Stripe's generic confirmation.
3. **Live Stripe account configured** — a live Payment Link exists,
   created inside the Stripe account of the entity that legally receives
   the funds (not a personal account). *(Not started — depends on IPNLF
   confirming that entity.)*
4. **Live payment flow verified** — a real transaction has actually been
   run through the live link and confirmed end to end. *(Not started.)*

`SITE_CONFIG.stripeMode` in `config.js` is a human-readable flag (not
used by any code logic) — currently `"test-verified"`, reflecting state
2 above, now fully confirmed. Per instruction, this pass deliberately
did **not** touch live mode or any personal bank account. States 3–4
(live account, live flow) remain untouched, waiting on IPNLF confirming
the receiving entity.

**Two other things the real Sandbox checkout surfaced, not previously
known:**
- **Currency is GBP, not USD.** The Payment Link charges in £. I've
  updated `config.js` (`currencySymbol`/`currencyCode`) and the on-page
  preset buttons to match — they now show £25/£50/£100. If GBP isn't
  actually the intended settlement currency, this needs correcting at
  the Stripe Product level, not just in our config.
- ~~Product name in Stripe was "Support Tuna Truth", missing "The"~~ —
  **fixed**, now reads "Support The Tuna Truth" in the live checkout.
- Klarna and Revolut Pay are both offered as payment methods alongside
  card, in addition to card — Stripe's account-level default payment
  methods, not something this page's code controls. Worth a quick look
  at whether "pay later" via Klarna is a fit for a donation (not wrong,
  just worth a deliberate yes/no rather than leaving Stripe's default).

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
| "Why your support matters" body | `whySupportMatters()` | Holding copy — provisional until production confirms actual use of funds (merges the old "what your support helps achieve" + "why now" into one short block) |
| "IPNLF supports The Tuna Truth..." sentence | `credibility()` | Holding copy — needs IPNLF approval specifically (the only remaining holding copy in "Behind the film" — the synopsis, presenter bio and award mention are all now confirmed, see below) |
| Thank-you page body copy | `thank-you.html` | Holding copy — needs approval |
| Suggested donation amounts (£25/£50/£100) | `config.js` → `presetAmounts` | Explicitly labelled "provisional" on-page; real amounts TBC |
| Settlement currency | `config.js` → `currencyCode` | Confirmed GBP from the real test Payment Link (see "Stripe readiness") |
| Privacy policy / Contact & refunds links | `footer()` | Labels only — both point to `#`, no real page/address yet |
| Receiving legal entity name | `footer()` copyright line | Deliberately omitted — do not add a name without IPNLF sign-off (see Stripe section: may not be the same entity as the production credit) |
| ~~TunaTruth site/socials link~~ | `credibility()` | **Done** — "Find out more →" now links to https://www.tunatruth.com/ |

**Already resolved with real, supplied material (not holding copy):**
- IPNLF's and The Tuna Truth's actual logos (`assets/img/ipnlf-logo.png`,
  `assets/img/tunatruth-logo.png`).
- Hero background photo (`assets/img/hero-photo.jpg`) and the OG
  social-share image (`assets/img/og-image.jpg`, cropped from the real
  poster) — genuine production stills, not stock photography.
- The "Behind the film" production credit (Sunline Films, IPNLF as
  executive producer, presenter Serena Appleby, director Sara Pipernos,
  supporting orgs) — copied directly from the official poster asset.
- The film's synopsis ("Filmed in the Azores..."), Serena Appleby's bio
  (chef, presenter of BBC Three's *Hungry For It*), and the Jackson
  Wild Award finalist nomination (Onscreen Personality category,
  alongside Sir David Attenborough and Benedict Cumberbatch) — supplied
  directly 2026-09-07, now in `credibility()`.
- The real Jackson Wild logo (`assets/img/jackson-wild-logo.png` — a
  supplied screenshot, not a clean transparent asset; sits in a bordered
  callout box in "Behind the film" and as a small text badge near the
  donate panel) and the real tunatruth.com link.

## Hard external dependencies

- **Stripe** — see "Stripe readiness" above; the test-mode redirect to
  `thank-you.html` still needs setting in the Stripe dashboard now that
  a real URL exists (see below), and IPNLF still needs to confirm the
  receiving entity for anything live.
- **Netlify deployment** — **done.** Live at
  https://tunatruthdonation.netlify.app/, connected to this GitHub repo
  (pushes redeploy automatically). Verified 2026-09-07: both `index.html`
  and `thank-you.html` load correctly on the live URL with no console
  errors.
- ~~Final domain~~ — **done.** `SITE_CONFIG.canonicalUrl`, the
  `og:url`/`og:image` meta tags in `index.html`, and
  `scripts/generate_qr.py`'s default all point at
  `https://tunatruthdonation.netlify.app/`, and the QR asset
  (`assets/qr/tunatruth-donate-qr.png`) has been regenerated against it.
  If the domain changes again later (e.g. a branded domain replaces the
  Netlify subdomain), update all three in the same pass and re-run the
  QR script again.

## Known / Assumption / Recommendation

- **Known:** the Bangkok deadline; the flow (landing → amount → Stripe →
  thank-you); test mode only for today's Stripe pass, explicitly not a
  live setup against a personal bank account.
- **Assumption:** the `tunatruthdonation.netlify.app` subdomain is
  acceptable for Bangkok rather than a custom domain; single "customer
  chooses amount" Payment Link is an acceptable donation mechanism.
- **Recommendation:** confirm the Stripe donation-price approach above
  before assuming per-amount fixed links; get the content-approval
  checklist moving in parallel with Stripe setup, since neither blocks
  the other.

## Not done yet (see chat report for full verification status)

A live Stripe account/entity and every item in the content-approval
checklist are still outstanding. Netlify deployment, the QR/domain, and
the full test-mode payment flow (including the redirect) are all done
and verified — see the readiness table in the chat reply for exactly
what has and hasn't been checked.
