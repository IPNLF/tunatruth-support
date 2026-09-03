/* ============================================================
   TUNATRUTH SUPPORT — SITE CONFIG
   Single place to change: the Stripe payment link, the brand
   hierarchy (IPNLF-first vs TunaTruth-first), and preset amounts.
   Nothing else in the codebase should hard-code a Stripe URL or
   assume which brand is "primary" — see README.md §Brand flip.
   ============================================================ */
const SITE_CONFIG = {

  // --- Payment -------------------------------------------------
  // TODO(stripe): replace with the real Payment Link.
  // This MUST be created inside the Stripe account belonging to the
  // legal entity that will receive the funds — do not point this at
  // a Stripe account that isn't that entity's own, even for testing.
  // Set up as a single Payment Link with a "customer chooses the
  // amount" price (Stripe's donation-price feature), with a min
  // amount set, and "after payment" set to redirect to this site's
  // thank-you.html. That one URL is the only thing that needs to
  // change between test mode, live mode, or a future provider swap.
  stripePaymentLinkUrl: "https://example.com/PLACEHOLDER-stripe-payment-link",

  // --- Preset donation amounts (provisional — see README) -------
  // Illustrative only. Not tied to any confirmed impact claim.
  // Replace once IPNLF supplies real suggested amounts.
  presetAmounts: [25, 50, 100],
  currencySymbol: "$",
  currencyCode: "USD", // ASSUMPTION — confirm settlement currency with IPNLF/Stripe account owner

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
  canonicalUrl: "https://tunatruth-support.netlify.app/",

  // --- Share -------------------------------------------------------
  shareText: "Support TunaTruth — a documentary backed by IPNLF.",
};
