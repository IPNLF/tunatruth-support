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

  function awardBadge() {
    return `<div class="tt-award-badge">
      <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2 9.5 8.5 3 9l5 4.5L6.5 20 12 16.3 17.5 20 16 13.5l5-4.5-6.5-.5L12 2Z"/></svg>
      <span>Jackson Wild Award finalist</span>
    </div>`;
  }

  function donatePanel() {
    return `<div class="tt-donate-panel">
      ${awardBadge()}
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
        <!-- Confirmed copy, supplied 2026-09-07 -->
        <p class="tt-card__body">Filmed in the Azores, Portugal, ${cfg.filmName} shines a light on troubling aspects of the seafood industry and invites viewers on a journey towards more sustainable, responsible choices.</p>
        <!-- Confirmed factual credit, sourced directly from the official poster asset, presenter bio supplied 2026-09-07 -->
        <p class="tt-card__body">${cfg.filmName} is a Sunline Films production, commissioned and executive produced by IPNLF (International Pole &amp; Line Foundation), presented by chef Serena Appleby (BBC Three's <em>Hungry For It</em>) and produced and directed by Sara Pipernos — made with support from Human Rights at Sea, Blue Marine Foundation and Sustainable Communities and Fisheries Trust.</p>
        <!-- Confirmed copy, supplied 2026-09-07 -->
        <p class="tt-card__body">${cfg.filmName} has been shortlisted as a finalist for a Jackson Wild Award — widely regarded as the nature-film world's equivalent of the Oscars® — nominated in the Onscreen Personality category alongside Sir David Attenborough and Benedict Cumberbatch.</p>
        <!-- HOLDING COPY — requires IPNLF approval before launch -->
        <p class="tt-card__body">IPNLF supports ${cfg.filmName} as part of its work to promote thriving coastal communities and environmentally and socially responsible tuna fisheries.</p>
        <div class="tt-credibility__links">
          <a href="https://ipnlf.org" target="_blank" rel="noopener">About IPNLF →</a>
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
        <!-- Privacy/contact links point nowhere yet (href="#") — real pages/addresses
             needed before launch; see README's content-approval checklist -->
        <nav class="tt-footer__links" aria-label="Legal and contact">
          <a href="#">Privacy policy</a>
          <a href="#">Contact &amp; refunds</a>
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
