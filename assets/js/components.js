/* ============================================================
   TUNATRUTH SUPPORT — COMPONENTS
   Plain functions returning HTML strings (same lightweight
   pattern used on other IPNLF micro-sites) — no framework.
   Brand hierarchy is read from SITE_CONFIG.brandOrder so the
   IPNLF <-> TunaTruth emphasis can flip without editing markup
   here. See README.md "Brand flip" for how.
   ============================================================ */
const TT = (() => {

  const cfg = SITE_CONFIG;
  const isIpnlfPrimary = cfg.brandOrder.primary === "ipnlf";

  // ---- small building blocks ----------------------------------

  function wordmarkIpnlf(size) {
    return `<img class="tt-logo tt-logo--ipnlf tt-logo--${size}" src="assets/img/ipnlf-logo.png" alt="IPNLF — for one-by-one fishers">`;
  }

  function wordmarkTunaTruth(size) {
    return `<img class="tt-logo tt-logo--tunatruth tt-logo--${size}" src="assets/img/tunatruth-logo.png" alt="The Tuna Truth, with Serena Appleby">`;
  }

  function brandLockup() {
    // Returns the header lock-up in whichever order is configured as primary.
    const primary = isIpnlfPrimary ? wordmarkIpnlf("sm") : wordmarkTunaTruth("sm");
    const secondaryLabel = isIpnlfPrimary ? "supports" : "presented by";
    const secondary = isIpnlfPrimary ? wordmarkTunaTruth("xs") : wordmarkIpnlf("xs");
    return `<div class="tt-lockup">
      ${primary}
      <span class="tt-lockup__joiner">${secondaryLabel}</span>
      ${secondary}
    </div>`;
  }

  function header() {
    return `<header class="tt-header">
      <div class="tt-container tt-header__inner">
        ${brandLockup()}
        <a class="tt-header__link" href="https://ipnlf.org" target="_blank" rel="noopener">ipnlf.org</a>
      </div>
    </header>`;
  }

  // ---- the above-the-fold identity + donation panel ------------

  function amountPicker() {
    const buttons = cfg.presetAmounts.map((amt, i) => `
      <button type="button" class="tt-amount ${i === 1 ? "is-selected" : ""}" data-amount="${amt}">
        ${cfg.currencySymbol}${amt}
      </button>`).join("");
    return `<div class="tt-amounts" role="group" aria-label="Choose a donation amount">
      ${buttons}
      <button type="button" class="tt-amount tt-amount--other" data-amount="other">Other</button>
    </div>`;
  }

  function donatePanel() {
    return `<div class="tt-donate-panel">
      <p class="tt-donate-panel__eyebrow">Support the documentary</p>
      ${amountPicker()}
      <p class="tt-donate-panel__note">Provisional amounts — final suggested amounts to be confirmed.</p>
      <a class="tt-cta" href="${cfg.stripePaymentLinkUrl}" data-role="donate-cta">
        Donate now
      </a>
      <p class="tt-donate-panel__trust">
        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4Zm-1 14.59-4.3-4.3 1.42-1.41L11 12.76l5.88-5.88 1.41 1.41L11 15.59Z"/></svg>
        Secure payment via Stripe · presented by IPNLF
      </p>
    </div>`;
  }

  function heroDonate() {
    return `<section class="tt-hero">
      <div class="tt-container tt-hero__grid">
        <div class="tt-hero__identity">
          <p class="tt-hero__eyebrow">A documentary supported by IPNLF</p>
          <h1 class="tt-hero__title">${wordmarkTunaTruth("lg")}</h1>
          <p class="tt-hero__support-line">
            [PLACEHOLDER — one short sentence on what the film is and why support matters]
          </p>
        </div>
        <div class="tt-hero__panel">
          ${donatePanel()}
        </div>
      </div>
    </section>`;
  }

  // ---- supporting sections (below the fold) --------------------

  function whatAndWhy() {
    return `<section class="tt-section" id="about">
      <div class="tt-container tt-section__grid">
        <div class="tt-card">
          <h2 class="tt-card__title">What TunaTruth is</h2>
          <p class="tt-card__body">[PLACEHOLDER — 50–100 word synopsis of the documentary: subject, focus, why IPNLF is involved. Do not publish without real copy supplied by the production/IPNLF.]</p>
        </div>
        <div class="tt-card">
          <h2 class="tt-card__title">What your support helps achieve</h2>
          <p class="tt-card__body">[PLACEHOLDER — real, specific detail on what additional funding enables: reach, distribution, translation, festival/screening costs, etc. No invented figures or outcomes.]</p>
        </div>
        <div class="tt-card">
          <h2 class="tt-card__title">Why now</h2>
          <p class="tt-card__body">[PLACEHOLDER — context on the current screening/campaign moment, e.g. Bangkok industry screening, to explain the urgency of support.]</p>
        </div>
      </div>
    </section>`;
  }

  function shareBlock() {
    return `<section class="tt-section tt-section--soft" id="share">
      <div class="tt-container tt-share">
        <h2 class="tt-share__title">Already supported? Help it travel further.</h2>
        <p class="tt-share__body">Share this page with someone who'd want to back the film.</p>
        <div class="tt-share__actions">
          <button type="button" class="tt-btn-secondary" data-role="copy-link">Copy link</button>
          <a class="tt-btn-secondary" data-role="share-email" href="#">Share by email</a>
        </div>
        <p class="tt-share__copied" data-role="copy-confirm" hidden>Link copied.</p>
      </div>
    </section>`;
  }

  function credibility() {
    return `<section class="tt-section" id="credibility">
      <div class="tt-container tt-credibility">
        <h2 class="tt-card__title">Behind the film</h2>
        <p class="tt-card__body">The Tuna Truth is a Sunline Films production, executive produced by IPNLF (International Pole &amp; Line Foundation), presented by Serena Appleby and produced and directed by Sara Pipernos — made with support from Human Rights at Sea, Blue Marine Foundation and Sustainable Communities and Fisheries Trust.</p>
        <p class="tt-card__body">[PLACEHOLDER — a further sentence or two on why IPNLF specifically backs this film and what it means for IPNLF's wider one-by-one fishing mission, if useful beyond the credit above.]</p>
        <div class="tt-credibility__links">
          <a href="https://ipnlf.org" target="_blank" rel="noopener">About IPNLF →</a>
          <span class="tt-credibility__placeholder">[TunaTruth site/socials link — placeholder]</span>
        </div>
      </div>
    </section>`;
  }

  function footer() {
    const year = new Date().getFullYear();
    return `<footer class="tt-footer">
      <div class="tt-container tt-footer__inner">
        <div class="tt-footer__brands">
          <span class="tt-logo-chip">${wordmarkIpnlf("xs")}</span>
          <span class="tt-footer__x">×</span>
          ${wordmarkTunaTruth("xs")}
        </div>
        <nav class="tt-footer__links" aria-label="Legal and contact">
          <a href="#">[Privacy policy — placeholder]</a>
          <a href="#">[Refund/contact information — placeholder]</a>
          <a href="https://ipnlf.org" target="_blank" rel="noopener">ipnlf.org</a>
        </nav>
        <p class="tt-footer__copy">© ${year} IPNLF. [Legal receiving-entity name — placeholder].</p>
      </div>
    </footer>`;
  }

  // ---- behaviour --------------------------------------------------

  function initInteractions() {
    const amountButtons = document.querySelectorAll(".tt-amount");
    amountButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        amountButtons.forEach((b) => b.classList.remove("is-selected"));
        btn.classList.add("is-selected");
      });
    });

    const copyBtn = document.querySelector('[data-role="copy-link"]');
    if (copyBtn) {
      copyBtn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(cfg.canonicalUrl);
          const confirmEl = document.querySelector('[data-role="copy-confirm"]');
          if (confirmEl) {
            confirmEl.hidden = false;
            setTimeout(() => { confirmEl.hidden = true; }, 2500);
          }
        } catch (e) {
          try { window.prompt("Copy this link:", cfg.canonicalUrl); } catch (e2) { /* no-op: environment supports neither */ }
        }
      });
    }

    const emailBtn = document.querySelector('[data-role="share-email"]');
    if (emailBtn) {
      const subject = encodeURIComponent("Support TunaTruth");
      const body = encodeURIComponent(`${cfg.shareText}\n\n${cfg.canonicalUrl}`);
      emailBtn.href = `mailto:?subject=${subject}&body=${body}`;
    }
  }

  return {
    header, heroDonate, whatAndWhy, shareBlock, credibility, footer,
    initInteractions,
  };
})();
