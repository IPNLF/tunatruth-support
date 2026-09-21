/* ============================================================
   TUNATRUTH SUPPORT — SITE CONFIG
   Single place to change: the Stripe payment link, the brand
   hierarchy (IPNLF-first vs TunaTruth-first), and preset amounts.
   Nothing else in the codebase should hard-code a Stripe URL or
   assume which brand is "primary" — see README.md §Brand flip.
   ============================================================ */
const SITE_CONFIG = {

  // --- Payment -------------------------------------------------
  // stripeMode is a human-readable flag only (nothing in the code
  // branches on it) — it exists so anyone reading this file can see
  // at a glance which of the four readiness states below applies:
  //   "test"          — a Stripe TEST-mode Payment Link is wired in,
  //                     but the flow hasn't been run end-to-end yet.
  //   "test-verified" — TEST-mode link verified: successful payment,
  //                     declined payment, and (once set) the redirect
  //                     to thank-you.html have all been checked by
  //                     hand. No real money moves. Current state —
  //                     verified 2026-09-07, EXCEPT the redirect (see
  //                     README "Stripe readiness" for the one thing
  //                     still open).
  //   "live-unverified" — a live Payment Link is in place but the
  //                     full live flow hasn't been run end-to-end yet.
  //   "live"          — live, verified, and under the correct
  //                     receiving entity's own Stripe account. Do not
  //                     set this until IPNLF has confirmed that entity.
  stripeMode: "live-unverified",

  // LIVE Payment Link — confirmed live on IPNLF's own account: checkout
  // shows business name "IPNLF", no Sandbox badge, correct amount/
  // product. Replaced 2026-09-10 (product catalogue cleanup after the
  // accidental duplicate products were sorted out) — this is the
  // FLEXIBLE ("customer chooses price") link, used for the "Other"
  // amount button — see presetAmounts below for the fixed-price links.
  // NOT yet run end-to-end with a real transaction — see stripeMode.
  stripePaymentLinkUrl: "https://donate.stripe.com/aFa9AT0Kx2lHb836hF97G05",

  // --- Preset donation amounts (provisional — see README) -------
  // Illustrative only. Not tied to any confirmed impact claim.
  // Replace once IPNLF supplies real suggested amounts.
  //
  // Each preset has its own fixed-price Payment Link — live. $500's
  // link was replaced 2026-09-10 alongside the "Other" link above
  // (same product-catalogue cleanup); $50/$200 unchanged. Selecting an
  // amount carries through to Stripe instead of landing on a default.
  // Trade-off, deliberately accepted: four links to keep in sync
  // instead of one — if amounts change, update both the amount here
  // AND create a matching new fixed-price link.
  presetAmounts: [
    { amount: 50, url: "https://donate.stripe.com/6oU3cveBnf8tekfeOb97G00" },
    { amount: 200, url: "https://donate.stripe.com/5kQ4gzdxj7G1ekfdK797G01" },
    { amount: 500, url: "https://donate.stripe.com/00wdR9dxjd0ldgb9tR97G06" },
  ],
  currencySymbol: "$",
  currencyCode: "USD", // Switched from GBP to USD 2026-09-10 per request — new Payment Link created in USD

  // --- Brand hierarchy -------------------------------------------
  // "primary" gets top billing (first lock-up, larger lock-up in the
  // header/hero); "secondary" is still named prominently but
  // deferred to. Flip this one value to change the whole page's
  // hierarchy without touching layout markup.
  brandOrder: {
    primary: "ipnlf",
    secondary: "tunatruth",
  },

  // --- Canonical URL ----------------------------------------------
  // Used for Open Graph tags and the QR code. Update once a final
  // domain (custom or GitHub Pages URL) is chosen, then regenerate the
  // QR asset with scripts/generate_qr.py. Moved off Netlify 2026-09-08
  // to GitHub Pages, then onto this custom subdomain 2026-09-10 (DNS
  // for tunatruth.com is managed via the same Wix account as the main
  // site; ipnlf.org's DNS is managed elsewhere, so this subdomain of
  // the film's own domain was the fastest real option).
  canonicalUrl: "https://donate.tunatruth.com/",

  // --- Naming -------------------------------------------------------
  // Centralised so "The Tuna Truth" is the only form used in prose
  // across the site — change it here once, not instance by instance,
  // if official brand guidance ever specifies otherwise.
  filmName: "The Tuna Truth",

  // --- Share -------------------------------------------------------
  shareText: "Support The Tuna Truth — a documentary backed by IPNLF.",

  // ================================================================
  // PROTOTYPE FEATURES (2026-09-21 fork) — feasibility/design review
  // only. Nothing below this line should reach the live site until
  // explicitly confirmed and merged back into master deliberately.
  // ================================================================

  // --- Fundraising progress bar (PROTOTYPE) ------------------------
  // Manually updated, not live-linked to Stripe. We looked at
  // automating this before: Stripe Payment Links have no public
  // "amount raised so far" endpoint, so showing a real-time total
  // would need a small backend polling the Stripe API and caching a
  // number for the page to read — real infrastructure, not a config
  // edit. For a short campaign, hand-updating `raisedAmount` here
  // (checking Stripe's Dashboard periodically) is the pragmatic
  // trade-off — flagged explicitly so it's a deliberate choice, not
  // an oversight.
  fundraisingProgress: {
    enabled: true,
    raisedAmount: 2500, // PLACEHOLDER — set to 25% of goal for screenshot purposes; update by hand as donations come in
    goalAmount: 10000, // PLACEHOLDER — needs a real confirmed target from IPNLF, do not treat as final
  },

  // --- Supporter reward tiers (PROTOTYPE, not confirmed) -----------
  // Index-matched to presetAmounts above (rewardTiers[0] describes
  // presetAmounts[0]'s tier, and so on). "Other" intentionally has no
  // reward line. ALL copy here is placeholder for design/feasibility
  // review — per the brief's "do not invent fulfilment promises,"
  // none of this should be presented to real donors as an actual
  // commitment until IPNLF has confirmed real rewards. The visible
  // page no longer marks this "(provisional)" — the only remaining
  // on-page cue is this comment and the README's content-approval
  // checklist, so don't let this go live without a deliberate check.
  rewardTiers: [
    "TunaTruth tote bag",
    "Screening hosting kit",
    "Name in credits",
  ],

  // --- Reward tier detail (PROTOTYPE, empty placeholders) -----------
  // Shown in the hover/focus tooltip on the (?) next to each reward in
  // whyAndRewardsSection() — index-matched to rewardTiers above. Left
  // empty deliberately: fill each one in directly here rather than in
  // components.js, so the tooltip copy lives in the same place as the
  // rest of the not-yet-confirmed reward content.
  rewardDetails: [
    "", // $50 — TunaTruth tote bag
    "", // $200 — Screening hosting kit
    "", // $500 — Name in credits
  ],
};
