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

  // `linked` wraps the mark in a link to tunatruth.com — on by default
  // for the header lockup (2026-09-22); the hero's large wordmark and
  // the footer's small one stay unlinked, matching how they were
  // before, since only the header link was requested.
  function wordmarkTunaTruth(size, linked = false) {
    const img = `<img class="tt-logo tt-logo--tunatruth tt-logo--${size}" src="assets/img/tunatruth-logo.png" alt="The Tuna Truth, with Serena Appleby">`;
    if (!linked) return img;
    return `<a href="https://www.tunatruth.com/" target="_blank" rel="noopener" aria-label="The Tuna Truth (opens tunatruth.com)">${img}</a>`;
  }

  function brandLockup() {
    // Returns the header lock-up in whichever order is configured as primary.
    const primary = isIpnlfPrimary ? wordmarkIpnlf("sm") : wordmarkTunaTruth("sm", true);
    const secondaryLabel = isIpnlfPrimary ? "supports" : "presented by";
    const secondary = isIpnlfPrimary ? wordmarkTunaTruth("xs", true) : wordmarkIpnlf("xs");
    return `<div class="tt-lockup">
      ${primary}
      <span class="tt-lockup__joiner">${secondaryLabel}</span>
      ${secondary}
    </div>`;
  }

  function header() {
    // Both marks in the lockup are themselves links (to ipnlf.org and
    // tunatruth.com respectively — see wordmarkIpnlf()/wordmarkTunaTruth())
    // — no need for separate text links too.
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
      <button type="button" class="tt-amount ${i === DEFAULT_PRESET_INDEX ? "is-selected" : ""}" data-amount="${preset.amount}" data-url="${preset.url}" data-reward="${(cfg.rewardTiers && cfg.rewardTiers[i]) || ""}">
        ${cfg.currencySymbol}${preset.amount}
      </button>`).join("");
    // PROTOTYPE (2026-09-22) — "Other" is a flexible Stripe link: the
    // donor types their own amount on Stripe's page, after leaving this
    // site, so we never see the actual figure here and can't show a
    // specific tier. Rather than showing nothing (which implied a $1000
    // gift via "Other" got no reward at all, unlike the same amount via
    // a preset), it gets a generic, amount-agnostic hint instead. The
    // lowest threshold is read from presetAmounts so this stays correct
    // if the amounts ever change.
    const lowestThreshold = cfg.presetAmounts[0] ? cfg.presetAmounts[0].amount : null;
    const otherReward = (cfg.rewardTiers && cfg.rewardTiers.length && lowestThreshold)
      ? `a thank-you reward, if your gift qualifies (${cfg.currencySymbol}${lowestThreshold}+)`
      : "";
    return `<div class="tt-amounts" role="group" aria-label="Choose a donation amount">
      ${buttons}
      <button type="button" class="tt-amount tt-amount--other" data-amount="other" data-url="${cfg.stripePaymentLinkUrl}" data-reward="${otherReward}">Other</button>
    </div>`;
  }

  // ---- PROTOTYPE (2026-09-21 fork) — fundraising progress bar ------
  // Manually updated, not live-linked to Stripe — see config.js
  // fundraisingProgress for why. Numbers are placeholders; the goal
  // in particular must not be treated as a real, confirmed target.
  function fundraisingProgressBar() {
    const p = cfg.fundraisingProgress;
    if (!p || !p.enabled) return "";
    const pct = Math.max(0, Math.min(100, Math.round((p.raisedAmount / p.goalAmount) * 100)));
    return `<!-- PROTOTYPE — manually-updated progress, not live-linked to Stripe; goalAmount is a placeholder, not a confirmed target -->
    <div class="tt-progress">
      <div class="tt-progress__stats">
        <span class="tt-progress__raised">${cfg.currencySymbol}${p.raisedAmount.toLocaleString()} raised</span>
        <span class="tt-progress__goal">of ${cfg.currencySymbol}${p.goalAmount.toLocaleString()} goal</span>
      </div>
      <div class="tt-progress__track" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="Fundraising progress">
        <div class="tt-progress__fill" style="width:${pct}%"></div>
      </div>
    </div>`;
  }

  function donatePanel() {
    const defaultUrl = cfg.presetAmounts[DEFAULT_PRESET_INDEX].url;
    const defaultReward = (cfg.rewardTiers && cfg.rewardTiers[DEFAULT_PRESET_INDEX]) || "";
    return `<div class="tt-donate-panel">
      <p class="tt-donate-panel__eyebrow">Support the documentary</p>
      ${amountPicker()}
      <!-- PROTOTYPE (2026-09-21) — reward callout moved to live only on
           the CTA itself (below), so it's stated once, not twice
           (the line that used to sit here, above the button, is gone —
           see 2026-09-21 review). -->
      <div class="tt-cta-wrap">
        <a class="tt-cta" href="${defaultUrl}" data-role="donate-cta">
          Donate now
        </a>
        <span class="tt-cta__badge" data-role="cta-badge" ${defaultReward ? "" : "hidden"}>+ ${defaultReward}</span>
        <!-- PROTOTYPE (2026-09-21) — reward opt-out, UI ONLY: this
             checkbox does not currently reach Stripe or fulfilment.
             The Payment Link URL is a static link — nothing selected
             on this page travels with the donor to checkout. Real
             wiring would mean either (a) Stripe's own "custom fields"
             on the Payment Link, configured in the Stripe Dashboard,
             collected at checkout itself, or (b) a backend between
             this page and Stripe to carry the choice through as
             metadata. Flagging this here and in the review notes so
             it isn't mistaken for working end-to-end. -->
        <label class="tt-cta-optout" ${defaultReward ? "" : "hidden"} data-role="cta-optout">
          <input type="checkbox" checked data-role="cta-optout-check">
          Send me this reward
        </label>
      </div>
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
          <!-- PROTOTYPE (2026-09-21) — test: progress bar replacing the
               holding-copy support line here, to make amount raised more
               prominent above the fold. Original line preserved below in
               case this reverts. -->
          ${fundraisingProgressBar()}
          <!--
          <p class="tt-hero__support-line">
            Support the next stage of ${cfg.filmName} and help the film reach audiences around the world.
          </p>
          -->
        </div>
        <div class="tt-hero__panel">
          ${donatePanel()}
        </div>
      </div>
    </section>`;
  }

  // ---- supporting sections (below the fold) --------------------

  // ---- PROTOTYPE (2026-09-21) — mockup C2: mission copy + rewards,
  // merged into one section ----
  // Superseded mockups A (full-width reward card grid), B (compact
  // strip), and C1 (even-column variant of this one): all either
  // buried the rewards too far down, or put them back in direct
  // competition with the mission copy. This is the version picked
  // after review — asymmetric split (mission copy gets more width and
  // reads first), reward amounts pick up the wordmark teal, nothing
  // else coloured.
  function whyAndRewardsSection() {
    const reward = (i) => (cfg.rewardTiers && cfg.rewardTiers[i]) || "";
    const detail = (i) => (cfg.rewardDetails && cfg.rewardDetails[i]) || "";
    const rewardItems = cfg.presetAmounts.map((preset, i) => {
      if (!reward(i)) return "";
      // PROTOTYPE (2026-09-21) — (?) info affordance per reward, for
      // adding detail copy later. Tooltip text comes from
      // config.js rewardDetails (currently empty placeholders) — the
      // icon still renders with nothing to show yet, so it's obvious
      // where to fill copy in rather than silently doing nothing.
      //
      // PROTOTYPE (2026-09-22) — "+" added after the amount: these are
      // thresholds ("this amount or more"), not exact-match brackets.
      // A $1000 gift via the flexible "Other" link should still count
      // for the $500 tier — see amountPicker()'s otherReward comment
      // for why we can't show a specific tier on that button itself.
      return `
      <li>
        <span class="reward-amount">${cfg.currencySymbol}${preset.amount}+</span> — ${reward(i)}
        <span class="reward-info" tabindex="0" role="button" aria-label="More detail about the ${reward(i)} reward" data-tooltip="${detail(i) || "Detail to be added"}">?</span>
      </li>`;
    }).join("");

    const whyColumn = `<div class="tt-merged__why">
        <h2>Why your support matters</h2>
        <!-- HOLDING COPY — provisional until production confirms specific use of funds -->
        <p>The film is entering the next stage of its journey. Further support will help it reach wider audiences through screenings, distribution and engagement.</p>
        <a href="#credibility">About the film →</a>
      </div>`;

    const rewardsColumn = cfg.rewardTiers && cfg.rewardTiers.length
      ? `<!-- PROTOTYPE — reward tiers, not confirmed; see config.js rewardTiers -->
      <div class="tt-merged__rewards">
        <h2>What you'll get</h2>
        <ul class="reward-list">${rewardItems}</ul>
      </div>`
      : "";

    return `<section class="tt-section tt-merged" id="why">
      <div class="tt-container">
        <div class="tt-merged__grid">
          ${whyColumn}
          ${rewardsColumn}
        </div>
      </div>
    </section>`;
  }

  function shareBlock() {
    return `<section class="tt-section tt-section--soft" id="share">
      <div class="tt-container tt-share">
        <h2 class="tt-share__title">Help the film travel further</h2>
        <p class="tt-share__body">Know someone who should see ${cfg.filmName}? Share the campaign and help its message and impact reach further.</p>
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
             Attenborough, Cumberbatch, Will Smith and Serena Appleby. The
             "Oscars of nature filmmaking" framing (2026-09-14 copy) is
             independently used by other outlets/finalists describing Jackson
             Wild (e.g. thepaperbear.org, africa.com), not just asserted here. -->
        <p class="tt-credibility__eyebrow">
          <img class="tt-credibility__award-mark" src="assets/img/jackson-wild-logo.png" alt="Jackson Wild" loading="lazy">
          Jackson Wild
        </p>
        <p>The Tuna Truth has been shortlisted as a finalist for a Jackson Wild Media Award. The awards are nature filmmaking's equivalent of the Oscars® and highlight the most impactful, innovative, and inspiring storytelling in the space.</p>
        <p>The film has been nominated in the Onscreen Personality category alongside Sir David Attenborough, Benedict Cumberbatch and Will Smith.</p>

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
    const ctaBadge = document.querySelector('[data-role="cta-badge"]');
    const ctaOptout = document.querySelector('[data-role="cta-optout"]');
    const ctaOptoutCheck = document.querySelector('[data-role="cta-optout-check"]');
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
        // PROTOTYPE — reward tier reveal, not confirmed (see config.js
        // rewardTiers). "Other" and any preset without a mapped reward
        // hides the badge and opt-out row rather than showing them empty.
        const reward = btn.dataset.reward || "";
        if (ctaBadge) {
          ctaBadge.textContent = reward ? `+ ${reward}` : "";
          ctaBadge.hidden = !reward;
        }
        if (ctaOptout) {
          ctaOptout.hidden = !reward;
        }
      });
    });

    // PROTOTYPE (2026-09-21) — reward opt-out checkbox, UI ONLY: see
    // the comment in donatePanel() in this file. Unchecking it here
    // does not (yet) change what Stripe or fulfilment receives.
    if (ctaOptoutCheck && ctaBadge) {
      ctaOptoutCheck.addEventListener("change", () => {
        ctaBadge.classList.toggle("tt-cta__badge--optedout", !ctaOptoutCheck.checked);
      });
    }

    // PROTOTYPE (2026-09-21) — (?) tooltip per reward: click/tap toggles
    // it too (not just hover), so it works on touch devices.
    document.querySelectorAll(".reward-info").forEach((el) => {
      el.addEventListener("click", () => el.classList.toggle("is-open"));
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
    header, heroDonate, whyAndRewardsSection, shareBlock, credibility, footer,
    initInteractions,
  };
})();
