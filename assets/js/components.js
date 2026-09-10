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
    return `<a href="https://ipnlf.org" target="_blank" rel="noopener" aria-label="IPNLF — for one-by-one fishers (opens ipnlf.org)">
      <img class="tt-logo tt-logo--ipnlf tt-logo--${size}" src="assets/img/ipnlf-logo.png" alt="IPNLF — for one-by-one fishers">
    </a>`;
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
    // The IPNLF mark in the lockup is itself the link to ipnlf.org now
    // (see wordmarkIpnlf()) — no need for a separate text link too.
    return `<header class="tt-header">
      <div class="tt-container tt-header__inner">
        ${brandLockup()}
      </div>
    </header>`;
  }

  // ---- the above-the-fold identity + donation panel ------------

  // Index of the preset that's selected by default (matches the
  // "is-selected" starting state) — its own fixed-price link is what
  // the CTA points at before anyone clicks anything.
  const DEFAULT_PRESET_INDEX = 1;

  function amountPicker() {
    const buttons = cfg.presetAmounts.map((preset, i) => `
      <button type="button" class="tt-amount ${i === DEFAULT_PRESET_INDEX ? "is-selected" : ""}" data-amount="${preset.amount}" data-url="${preset.url}">
        ${cfg.currencySymbol}${preset.amount}
      </button>`).join("");
    return `<div class="tt-amounts" role="group" aria-label="Choose a donation amount">
      ${buttons}
      <button type="button" class="tt-amount tt-amount--other" data-amount="other" data-url="${cfg.stripePaymentLinkUrl}">Other</button>
    </div>`;
  }

  function donatePanel() {
    const defaultUrl = cfg.presetAmounts[DEFAULT_PRESET_INDEX].url;
    return `<div class="tt-donate-panel">
      <p class="tt-donate-panel__eyebrow">Support the documentary</p>
      ${amountPicker()}
      <a class="tt-cta" href="${defaultUrl}" data-role="donate-cta">
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
          <!-- HOLDING COPY — requires IPNLF/production approval before launch -->
          <p class="tt-hero__support-line">
            Support the next stage of ${cfg.filmName} and help the film reach audiences around the world.
          </p>
        </div>
        <div class="tt-hero__panel">
          ${donatePanel()}
        </div>
      </div>
    </section>`;
  }

  // ---- supporting sections (below the fold) --------------------

  // Deliberately one short block, not three — the donor only needs
  // reassurance that support has a clear purpose here; deeper subject
  // matter lives lower down in credibility(), not competing with this.
  function whySupportMatters() {
    return `<section class="tt-section tt-why" id="why">
      <div class="tt-container tt-why__inner">
        <h2 class="tt-why__title">Why your support matters</h2>
        <!-- HOLDING COPY — provisional until production confirms specific use of funds -->
        <p class="tt-why__body">The film is entering the next stage of its journey. Further support will help it reach wider audiences through screenings, distribution and engagement.</p>
        <a class="tt-why__link" href="#credibility">About the film →</a>
      </div>
    </section>`;
  }

  function shareBlock() {
    return `<section class="tt-section tt-section--soft" id="share">
      <div class="tt-container tt-share">
        <h2 class="tt-share__title">Help the film travel further</h2>
        <p class="tt-share__body">Know someone who should see ${cfg.filmName}? Share the campaign and help us reach the next audience.</p>
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

        <!-- Confirmed factual credit, sourced directly from the official poster asset -->
        <p>${cfg.filmName} is a Sunline Films production, commissioned and executive produced by IPNLF, presented by chef Serena Appleby and produced and directed by Sara Pipernos, with support from Human Rights at Sea, Blue Marine Foundation and Sustainable Communities and Fisheries Trust.</p>

        <!-- HOLDING COPY — requires production/IPNLF approval before launch -->
        <p>Filmed in the Azores, Portugal, ${cfg.filmName} shines a light on troubling aspects of the seafood industry and invites viewers on a journey towards more sustainable, responsible choices.</p>

        <!-- HOLDING COPY — requires IPNLF approval before launch -->
        <p>IPNLF supports the film as part of its work to promote thriving coastal communities and environmentally and socially responsible tuna fisheries.</p>

        <!-- Confirmed 2026-09-08 against Jackson Wild's own 2026 Media Awards
             page (jacksonwild.org/2026-media-awards) and the Human Rights at
             Sea article on Sunline Films — Onscreen Personality finalists are
             Attenborough, Cumberbatch, Will Smith and Serena Appleby. Kept to
             one plain, attributable claim ("finalist") rather than an
             unsourced "Oscars of nature film" comparison. -->
        <p class="tt-credibility__eyebrow">Jackson Wild</p>
        <p class="tt-credibility__award-line">
          <img class="tt-credibility__award-mark" src="assets/img/jackson-wild-logo.png" alt="Jackson Wild" loading="lazy">
          <span><strong>Jackson Wild Award finalist</strong> — Serena Appleby was named a finalist in the Onscreen Personality category alongside Sir David Attenborough, Benedict Cumberbatch and Will Smith.</span>
        </p>

        <div class="tt-credibility__links">
          <a href="https://www.tunatruth.com/" target="_blank" rel="noopener">Find out more →</a>
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
          <a href="https://ipnlf.org/privacy-policy/" target="_blank" rel="noopener">Privacy policy</a>
          <a href="https://ipnlf.org" target="_blank" rel="noopener">ipnlf.org</a>
        </nav>
        <!-- The receiving legal entity is not yet confirmed — do not add a name here
             without IPNLF sign-off; see README's content-approval checklist -->
        <p class="tt-footer__copy">© ${year} IPNLF.</p>
      </div>
    </footer>`;
  }

  // ---- behaviour --------------------------------------------------

  function initInteractions() {
    const amountButtons = document.querySelectorAll(".tt-amount");
    const donateCta = document.querySelector('[data-role="donate-cta"]');
    amountButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        amountButtons.forEach((b) => b.classList.remove("is-selected"));
        btn.classList.add("is-selected");
        // Each preset (and "Other") carries its own Payment Link, so
        // selecting an amount actually changes what Stripe charges,
        // rather than always landing on one link's default amount.
        if (donateCta && btn.dataset.url) {
          donateCta.href = btn.dataset.url;
        }
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
      const subject = encodeURIComponent(`Support ${cfg.filmName}`);
      const body = encodeURIComponent(`${cfg.shareText}\n\n${cfg.canonicalUrl}`);
      emailBtn.href = `mailto:?subject=${subject}&body=${body}`;
    }
  }

  return {
    header, heroDonate, whySupportMatters, shareBlock, credibility, footer,
    initInteractions,
  };
})();
