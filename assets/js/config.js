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

  // LIVE Payment Link (switched from test 2026-09-10) — confirmed live
  // on IPNLF's own account: checkout shows business name "IPNLF", no
  // Sandbox badge, correct amount/product. NOT yet run end-to-end with
  // a real transaction — that's the one thing still needed to move
  // stripeMode from "live-unverified" to "live". This is the FLEXIBLE
  // ("customer chooses price") link, used for the "Other" amount
  // button — see presetAmounts below for the fixed-price live links.
  stripePaymentLinkUrl: "https://donate.stripe.com/8x24gzal78K57VRbBZ97G03",

  // --- Preset donation amounts (provisional — see README) -------
  // Illustrative only. Not tied to any confirmed impact claim.
  // Replace once IPNLF supplies real suggested amounts.
  //
  // Each preset has its own fixed-price Payment Link — live versions
  // supplied 2026-09-10, replacing the earlier test links. Selecting
  // an amount carries through to Stripe instead of landing on the
  // flexible link's default. Trade-off, deliberately accepted: four
  // links to keep in sync instead of one — if amounts change, update
  // both the amount here AND create a matching new fixed-price link.
  presetAmounts: [
    { amount: 50, url: "https://donate.stripe.com/6oU3cveBnf8tekfeOb97G00" },
    { amount: 200, url: "https://donate.stripe.com/5kQ4gzdxj7G1ekfdK797G01" },
    { amount: 500, url: "https://donate.stripe.com/9B63cv2SF4tPfoj49x97G02" },
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
};
