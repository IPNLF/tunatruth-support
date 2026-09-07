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
  stripeMode: "test-verified",

  // TEST-mode Payment Link (supplied 2026-09-07). Do NOT replace this
  // with a live link until IPNLF has confirmed the entity that legally
  // receives funds — a live link must be created inside THAT entity's
  // own Stripe account, not a personal one. That one URL is the only
  // thing that needs to change between test mode, live mode, or a
  // future provider swap.
  stripePaymentLinkUrl: "https://buy.stripe.com/test_dRmdRa4Hn5zufSMgG78bS00",

  // --- Preset donation amounts (provisional — see README) -------
  // Illustrative only. Not tied to any confirmed impact claim.
  // Replace once IPNLF supplies real suggested amounts.
  presetAmounts: [25, 50, 100],
  currencySymbol: "£",
  currencyCode: "GBP", // Confirmed 2026-09-07: the actual Stripe Payment Link charges in GBP

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
  // domain (custom or Netlify) is chosen, then regenerate the QR
  // asset with scripts/generate_qr.py.
  canonicalUrl: "https://tunatruthdonation.netlify.app/",

  // --- Naming -------------------------------------------------------
  // Centralised so "The Tuna Truth" is the only form used in prose
  // across the site — change it here once, not instance by instance,
  // if official brand guidance ever specifies otherwise.
  filmName: "The Tuna Truth",

  // --- Share -------------------------------------------------------
  shareText: "Support The Tuna Truth — a documentary backed by IPNLF.",
};
