const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");

const inlineIconPaths = {
  electronics: '<rect x="6" y="6" width="12" height="12" rx="2"></rect><path d="M9 9h6v6H9zM9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4"></path>',
  data: '<path d="M4 18V9m5 9V5m5 13v-7m5 7V3"></path><path d="m3 7 5-4 5 5 7-6"></path><circle cx="3" cy="7" r="1"></circle><circle cx="8" cy="3" r="1"></circle><circle cx="13" cy="8" r="1"></circle><circle cx="20" cy="2" r="1"></circle>',
  network: '<circle cx="12" cy="5" r="3"></circle><circle cx="5" cy="18" r="3"></circle><circle cx="19" cy="18" r="3"></circle><path d="m10.5 7.6-4 7.7m7-7.7 4 7.7M8 18h8"></path>',
  software: '<rect x="3" y="4" width="18" height="16" rx="2"></rect><path d="M3 8h18M8 12l-2 2 2 2m8-4 2 2-2 2m-2-5-4 6"></path>',
  energy: '<path d="m13 2-7 12h6l-1 8 7-12h-6l1-8Z"></path>',
  innovation: '<path d="M9 18h6m-5 3h4M8.5 15.5C6.9 14.4 6 12.6 6 10.5a6 6 0 1 1 12 0c0 2.1-.9 3.9-2.5 5"></path><path d="M12 14V9m0 0 3-2m-3 2L9 7"></path>',
  scope: '<circle cx="12" cy="12" r="8"></circle><circle cx="12" cy="12" r="3"></circle><path d="M12 2v3m0 14v3M2 12h3m14 0h3"></path>',
  prototype: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"></path><path d="m4 7.5 8 4.5 8-4.5M12 12v9"></path>',
  optimize: '<path d="M4 6h10m4 0h2M4 12h2m4 0h10M4 18h7m4 0h5"></path><circle cx="16" cy="6" r="2"></circle><circle cx="8" cy="12" r="2"></circle><circle cx="13" cy="18" r="2"></circle>',
  team: '<circle cx="9" cy="8" r="3"></circle><circle cx="17" cy="9" r="2"></circle><path d="M3 20v-2a6 6 0 0 1 12 0v2m1-6a4 4 0 0 1 5 4v2"></path>',
  brief: '<path d="M8 4H5a2 2 0 0 0-2 2v14h14v-3"></path><path d="m9 15 2-.4L20 6l-2-2-8.6 8.6L9 15Z"></path>',
  tracking: '<path d="M4 18V6m0 12h16"></path><path d="m6 15 4-4 3 2 6-7"></path>',
  delivery: '<path d="M6 2h9l4 4v16H6zM14 2v5h5"></path><path d="m9 15 2 2 5-5"></path>'
};

document.querySelectorAll("svg.feature-icon use").forEach((use) => {
  const id = (use.getAttribute("href") || use.getAttribute("xlink:href") || "").split("#").pop();
  const svg = use.closest("svg");
  if (svg && id && inlineIconPaths[id]) {
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.innerHTML = inlineIconPaths[id];
  }
});

const buildSpecialtyDropdown = () => {
  const specialtyLink = mainNav?.querySelector('a[href$="/specialites"], a[href$="/specialites/"], a[href="specialites"]');
  if (!specialtyLink) {
    return null;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "nav-dropdown";

  specialtyLink.classList.add("nav-dropdown-link");
  specialtyLink.before(wrapper);
  wrapper.appendChild(specialtyLink);

  const toggle = document.createElement("button");
  toggle.className = "nav-dropdown-toggle";
  toggle.type = "button";
  toggle.setAttribute("aria-label", "Afficher les spécialités");
  toggle.setAttribute("aria-expanded", "false");

  const menu = document.createElement("div");
  const menuId = "specialty-menu";
  menu.id = menuId;
  menu.className = "nav-dropdown-menu";
  toggle.setAttribute("aria-controls", menuId);

  const links = [
    ["Électronique, embarqué et IoT", "/prestations/electronique-iot/"],
    ["Data, IA et signal", "/prestations/data-ia-signal/"],
    ["Informatique et réseaux", "/prestations/reseaux-cybersecurite/"],
    ["Automatique, énergie et instrumentation", "/prestations/ingenierie-energie/"],
    ["Innovation, usage et faisabilité", "/prestations/innovation-responsable/"]
  ];

  links.forEach(([label, url]) => {
    const link = document.createElement("a");
    link.href = url;
    link.textContent = label;
    menu.appendChild(link);
  });

  wrapper.append(toggle, menu);

  const setOpen = (open) => {
    wrapper.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };

  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    setOpen(!wrapper.classList.contains("is-open"));
  });

  wrapper.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setOpen(false);
      toggle.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (!wrapper.contains(event.target)) {
      setOpen(false);
    }
  });

  return { wrapper, setOpen };
};

const specialtyDropdown = buildSpecialtyDropdown();

if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    mainNav.classList.toggle("is-open", !isOpen);
    if (isOpen) {
      specialtyDropdown?.setOpen(false);
    }
  });
}

// Accordion toggle
document.querySelectorAll(".accordion-header").forEach((header) => {
  if (header.closest(".expertise-detail-page")) return;

  header.setAttribute("role", "button");
  header.setAttribute("tabindex", "0");
  header.setAttribute("aria-expanded", String(header.closest(".accordion-item")?.classList.contains("is-open")));

  const toggleAccordion = () => {
    const item = header.closest(".accordion-item");
    item.classList.toggle("is-open");
    header.setAttribute("aria-expanded", String(item.classList.contains("is-open")));
  };

  header.addEventListener("click", () => {
    toggleAccordion();
  });

  header.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleAccordion();
    }
  });
});

const analyticsMeasurementId = "G-WDB5N84JFW";
const cookieConsentKey = "juniorEnsea.cookieConsent.v2";
const legacyCookieConsentKey = "juniorEnsea.cookieConsent.v1";
const consentValidityMs = 183 * 24 * 60 * 60 * 1000;
const analyticsCookieLifetimeSeconds = 183 * 24 * 60 * 60;
let googleAnalyticsConfigured = false;

window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function gtag() {
  window.dataLayer.push(arguments);
};

window.gtag("consent", "default", {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied"
});
window.gtag("set", "ads_data_redaction", true);

const clearGoogleAnalyticsCookies = () => {
  const analyticsCookiePattern = /^_(?:ga(?:$|_)|gid$|gat|gac_)/;
  const cookieNames = document.cookie
    .split(";")
    .map((cookie) => cookie.split("=")[0].trim())
    .filter((name) => analyticsCookiePattern.test(name));
  const hostname = window.location.hostname.replace(/^www\./, "");
  const canUseDomain = hostname && hostname !== "localhost" && !/^\d+(?:\.\d+){3}$/.test(hostname);

  cookieNames.forEach((name) => {
    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
    if (canUseDomain) {
      document.cookie = `${name}=; Max-Age=0; path=/; domain=${hostname}; SameSite=Lax`;
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.${hostname}; SameSite=Lax`;
    }
  });
};

const loadGoogleAnalytics = () => {
  if (googleAnalyticsConfigured) return;
  googleAnalyticsConfigured = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsMeasurementId}`;
  script.dataset.googleAnalytics = analyticsMeasurementId;
  document.head.appendChild(script);

  window.gtag("js", new Date());
  window.gtag("config", analyticsMeasurementId, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    cookie_expires: analyticsCookieLifetimeSeconds
  });
};

const applyAnalyticsPreference = (enabled) => {
  const analyticsEnabled = Boolean(enabled);
  document.documentElement.dataset.cookieAnalytics = String(analyticsEnabled);
  window.gtag("consent", "update", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: analyticsEnabled ? "granted" : "denied"
  });

  if (analyticsEnabled) {
    loadGoogleAnalytics();
  } else {
    clearGoogleAnalyticsCookies();
  }
};

const readCookieConsent = () => {
  try {
    window.localStorage.removeItem(legacyCookieConsentKey);
    const value = window.localStorage.getItem(cookieConsentKey);
    if (!value) return null;

    const consent = JSON.parse(value);
    const updatedAt = Date.parse(consent.updatedAt);
    if (!Number.isFinite(updatedAt) || Date.now() - updatedAt > consentValidityMs) {
      window.localStorage.removeItem(cookieConsentKey);
      clearGoogleAnalyticsCookies();
      return null;
    }

    return consent;
  } catch {
    return null;
  }
};

const saveCookieConsent = (preferences) => {
  const consent = {
    version: 2,
    necessary: true,
    analytics: Boolean(preferences.analytics),
    analyticsProvider: "Google Analytics 4",
    analyticsMeasurementId,
    updatedAt: new Date().toISOString()
  };

  try {
    window.localStorage.setItem(cookieConsentKey, JSON.stringify(consent));
  } catch {}

  document.documentElement.dataset.cookieAnalytics = String(consent.analytics);
  return consent;
};

const buildCookieConsent = () => {
  const existingConsent = readCookieConsent();
  if (existingConsent) {
    applyAnalyticsPreference(existingConsent.analytics);
  } else {
    applyAnalyticsPreference(false);
  }

  const banner = document.createElement("section");
  banner.className = "cookie-banner";
  banner.setAttribute("aria-label", "Gestion des cookies");
  banner.hidden = Boolean(existingConsent);
  banner.innerHTML = `
    <div class="cookie-banner-content">
      <p class="cookie-kicker">Confidentialité</p>
      <h2>Gestion des cookies</h2>
      <p>Google Analytics nous aide à comprendre la fréquentation du site. Il n'est chargé qu'après votre accord et vous pouvez refuser aussi simplement qu'accepter.</p>
    </div>
    <div class="cookie-banner-actions">
      <button class="btn btn-light" type="button" data-cookie-action="reject">Tout refuser</button>
      <button class="btn btn-secondary" type="button" data-cookie-action="customize">Personnaliser</button>
      <button class="btn btn-dark" type="button" data-cookie-action="accept">Tout accepter</button>
    </div>
  `;

  const panel = document.createElement("div");
  panel.className = "cookie-panel";
  panel.hidden = true;
  panel.innerHTML = `
    <div class="cookie-panel-dialog" role="dialog" aria-modal="true" aria-labelledby="cookie-panel-title">
      <button class="cookie-panel-close" type="button" aria-label="Fermer les préférences cookies" data-cookie-action="close">×</button>
      <p class="cookie-kicker">Préférences</p>
      <h2 id="cookie-panel-title">Choisir les cookies autorisés</h2>
      <div class="cookie-choice is-locked">
        <div>
          <strong>Cookies nécessaires</strong>
          <p>Indispensables au fonctionnement du site et à la mémorisation de votre choix.</p>
        </div>
        <span>Toujours actifs</span>
      </div>
      <label class="cookie-choice" for="cookie-analytics">
        <div>
          <strong>Mesure d'audience avec Google Analytics</strong>
          <p>Mesure les pages consultées, les sessions et les caractéristiques générales des appareils afin d'améliorer le site. Aucun cookie publicitaire n'est autorisé.</p>
        </div>
        <input id="cookie-analytics" type="checkbox">
      </label>
      <div class="cookie-panel-actions">
        <button class="btn btn-light" type="button" data-cookie-action="reject">Tout refuser</button>
        <button class="btn btn-dark" type="button" data-cookie-action="save">Enregistrer</button>
      </div>
    </div>
  `;

  const showPanel = () => {
    const consent = readCookieConsent();
    panel.querySelector("#cookie-analytics").checked = Boolean(consent?.analytics);
    panel.hidden = false;
    panel.querySelector(".cookie-panel-close")?.focus();
  };

  const closePanel = () => {
    panel.hidden = true;
  };

  const closeBanner = () => {
    banner.hidden = true;
    closePanel();
  };

  const applyChoice = (analytics) => {
    const consent = saveCookieConsent({ analytics });
    applyAnalyticsPreference(consent.analytics);
    closeBanner();
  };

  const handleAction = (action) => {
    if (action === "accept") applyChoice(true);
    if (action === "reject") applyChoice(false);
    if (action === "customize") showPanel();
    if (action === "save") applyChoice(panel.querySelector("#cookie-analytics").checked);
    if (action === "close") closePanel();
  };

  banner.addEventListener("click", (event) => {
    const action = event.target.closest("[data-cookie-action]")?.dataset.cookieAction;
    if (action) handleAction(action);
  });

  panel.addEventListener("click", (event) => {
    const action = event.target.closest("[data-cookie-action]")?.dataset.cookieAction;
    if (action) handleAction(action);
    if (event.target === panel) closePanel();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) closePanel();
  });

  document.querySelectorAll("[data-open-cookie-panel]").forEach((button) => {
    button.addEventListener("click", showPanel);
  });

  if (window.location.hash === "#cookies") {
    showPanel();
  }

  document.body.append(banner, panel);
};

buildCookieConsent();

const addStructuredData = () => {
  const productionOrigin = "https://junior-ensea.fr";
  const title = document.title;
  const description = document.querySelector('meta[name="description"]')?.content || "";
  const canonicalUrl =
    document.querySelector('link[rel="canonical"]')?.href || new URL(window.location.pathname, productionOrigin).href;
  const organizationId = `${productionOrigin}/#organization`;
  const websiteId = `${productionOrigin}/#website`;
  const logoUrl = `${productionOrigin}/assets/images/junior-ensea-logo-color-trimmed.png`;

  const organization = {
    "@type": "Organization",
    "@id": organizationId,
    name: "Junior ENSEA",
    legalName: "JUNIOR ENSEA (JE)",
    alternateName: "Bureau d'études associatif de l'ENSEA",
    url: `${productionOrigin}/`,
    logo: logoUrl,
    email: "contact@juniorensea.fr",
    identifier: {
      "@type": "PropertyValue",
      propertyID: "SIREN",
      value: "422374462"
    },
    vatID: "FR79422374462",
    address: {
      "@type": "PostalAddress",
      streetAddress: "6 avenue du Ponceau",
      postalCode: "95000",
      addressLocality: "Cergy",
      addressCountry: "FR"
    },
    sameAs: ["https://annuaire-entreprises.data.gouv.fr/entreprise/junior-ensea-je-422374462"],
    slogan: "Des élèves-ingénieurs au service de vos projets techniques",
    areaServed: "France",
    description: "Association étudiante de conseil technique de l'ENSEA mobilisant des élèves-ingénieurs pour réaliser des études, prototypes et solutions numériques.",
    knowsAbout: [
      "Électronique",
      "Systèmes embarqués",
      "Traitement du signal",
      "Data et intelligence artificielle",
      "Développement web et mobile",
      "Informatique et réseaux",
      "Instrumentation et énergie"
    ]
  };

  const website = {
      "@type": "WebSite",
      "@id": websiteId,
      name: "Junior ENSEA",
      url: `${productionOrigin}/`,
      publisher: { "@id": organizationId },
      inLanguage: "fr-FR"
    };

  const graph = [];
  if (!document.querySelector("script[data-entity-schema]")) {
    graph.push(organization, website);
  }

  graph.push(
    {
      "@type": "WebPage",
      "@id": `${canonicalUrl}#webpage`,
      name: title,
      description,
      url: canonicalUrl,
      isPartOf: { "@id": websiteId },
      about: { "@id": organizationId },
      inLanguage: "fr-FR"
    }
  );

  const breadcrumb = document.querySelector(".breadcrumb");
  if (breadcrumb) {
    const items = [];
    const seenUrls = new Set();
    const addItem = (name, item) => {
      const url = new URL(item, productionOrigin).href;
      if (!name || seenUrls.has(url)) return;
      seenUrls.add(url);
      items.push({ name, item: url });
    };

    addItem("Accueil", `${productionOrigin}/`);
    breadcrumb.querySelectorAll("a").forEach((link) => {
      addItem(link.textContent.trim(), link.getAttribute("href"));
    });
    const currentName = document.querySelector("h1")?.textContent.trim().replace(/\.$/, "");
    if (currentName) {
      addItem(currentName, canonicalUrl);
    }
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.item
      }))
    });
  }

  const canonicalPath = new URL(canonicalUrl).pathname;
  if (canonicalPath.startsWith("/prestations/") && canonicalPath !== "/prestations/") {
    graph.push({
      "@type": "Service",
      name: document.querySelector("h1")?.textContent.replace(/\.$/, "") || title,
      description,
      url: canonicalUrl,
      provider: { "@id": organizationId },
      areaServed: "France",
      serviceType: "Étude et conseil technique"
    });
  }

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.dataset.pageSchema = "";
  script.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
  document.head.appendChild(script);
};

addStructuredData();

const pageHeader = document.querySelector(".site-header");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.documentElement.classList.add("js-ready");

const revealGroups = [
  ".section-head",
  ".page-hero .container",
  ".hero-stat",
  ".core-specialty",
  ".core-specialties-note",
  ".home-offer",
  ".method-step",
  ".value-point",
  ".testimonial-copy > *",
  ".client-testimonial > *",
  ".partners-layout > *",
  ".contact-layout > *",
  ".project-cta-inner > *",
  ".wf-intro > *",
  ".wf-offer",
  ".wf-expertise-head > *",
  ".wf-expertise-item",
  ".wf-method-step",
  ".junior-proof article",
  ".org-row",
  ".editorial-band > *",
  ".contact-steps article",
  ".accordion-item",
  ".sticky-panel",
  ".sidebar-form",
  ".legal-box",
  ".sitemap-page .card",
  ".service-path-copy > *",
  ".service-result",
  ".services-band-head > *",
  ".services-expertise-grid a",
  ".services-method-grid article",
  ".about-story-copy > *",
  ".about-story-image",
  ".about-proof article",
  ".about-values-heading",
  ".about-values-clean article",
  ".about-timeline article",
  ".about-client-panel"
];

const revealItems = document.querySelectorAll(revealGroups.join(","));
const counterItems = document.querySelectorAll("[data-counter]");
revealItems.forEach((item, index) => {
  item.classList.add("reveal-item");
  item.style.setProperty("--reveal-delay", `${(index % 4) * 100}ms`);
});

const animateCounter = (counter) => {
  if (counter.dataset.animated === "true") {
    return;
  }

  counter.dataset.animated = "true";
  const target = Number(counter.dataset.counter);

  if (reduceMotion || !Number.isFinite(target)) {
    counter.textContent = String(target);
    return;
  }

  const duration = 1800;
  const startTime = performance.now();

  const tick = (time) => {
    const progress = Math.min((time - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = String(Math.round(target * eased));
    if (progress < 1) {
      window.requestAnimationFrame(tick);
    }
  };

  window.requestAnimationFrame(tick);
};

if ("IntersectionObserver" in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px" });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if ("IntersectionObserver" in window && !reduceMotion) {
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  counterItems.forEach((counter) => counterObserver.observe(counter));
} else {
  counterItems.forEach(animateCounter);
}

let scrollFrame = null;
const updateScrollEffects = () => {
  const scrollY = window.scrollY;
  pageHeader?.classList.toggle("is-scrolled", scrollY > 50);
  scrollFrame = null;
};

window.addEventListener("scroll", () => {
  if (scrollFrame === null) {
    scrollFrame = window.requestAnimationFrame(updateScrollEffects);
  }
}, { passive: true });

updateScrollEffects();
