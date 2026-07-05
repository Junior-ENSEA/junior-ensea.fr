const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");

const buildSpecialtyDropdown = () => {
  const specialtyLink = mainNav?.querySelector('a[href$="specialites.html"]');
  if (!specialtyLink) {
    return null;
  }

  const href = specialtyLink.getAttribute("href") || "specialites.html";
  const prefix = href.startsWith("../") ? "../" : "";
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
    ["Vue d'ensemble", `${prefix}specialites.html`],
    ["Electronique et systèmes embarqués", `${prefix}prestations/electronique-iot.html`],
    ["Data, IA et traitement du signal", `${prefix}prestations/data-ia-signal.html`],
    ["Réseaux et cybersécurité", `${prefix}prestations/reseaux-cybersecurite.html`],
    ["Logiciel et automatisation", `${prefix}prestations/logiciel-automatisation.html`],
    ["Automatique, énergie et instrumentation", `${prefix}prestations/ingenierie-energie.html`],
    ["Innovation, usages et écoconception", `${prefix}prestations/innovation-responsable.html`]
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

const firstDetailAccordion = document.querySelector(".expertise-detail-page .accordion-item");
if (firstDetailAccordion && !document.querySelector(".expertise-detail-page .accordion-item.is-open")) {
  firstDetailAccordion.classList.add("is-open");
  firstDetailAccordion.querySelector(".accordion-header")?.setAttribute("aria-expanded", "true");
}

const showFormspreePlaceholder = (form, event) => {
  const action = form.getAttribute("action") || "";
  const status = form.querySelector(".form-status");

  if (!action.includes("YOUR_FORM_ID")) {
    return false;
  }

  event.preventDefault();
  if (status) {
    status.textContent = "Endpoint Formspree a renseigner avant publication.";
  }
  return true;
};

document.querySelectorAll("form[data-formspree]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    showFormspreePlaceholder(form, event);
  });

  form.querySelectorAll('button[type="submit"]').forEach((button) => {
    button.addEventListener("click", (event) => {
      showFormspreePlaceholder(form, event);
    });
  });
});

const addStructuredData = () => {
  const title = document.title;
  const description = document.querySelector('meta[name="description"]')?.content || "";
  const logoUrl = new URL(
    document.querySelector(".brand img")?.getAttribute("src") || "assets/images/junior-ensea-logo-color-trimmed.png",
    window.location.href
  ).href;

  const organization = {
    "@type": "Organization",
    "@id": `${window.location.origin}/#organization`,
    name: "Junior ENSEA",
    url: window.location.origin,
    logo: logoUrl,
    description: "Bureau d'études étudiant de l'ENSEA spécialisé en électronique, systèmes embarqués, data, IA, cybersécurité, logiciel et innovation responsable."
  };

  const graph = [
    organization,
    {
      "@type": "WebSite",
      "@id": `${window.location.origin}/#website`,
      name: "Junior ENSEA",
      url: window.location.origin,
      publisher: { "@id": `${window.location.origin}/#organization` }
    },
    {
      "@type": "WebPage",
      "@id": window.location.href,
      name: title,
      description,
      url: window.location.href,
      isPartOf: { "@id": `${window.location.origin}/#website` }
    }
  ];

  const breadcrumb = document.querySelector(".breadcrumb");
  if (breadcrumb) {
    const items = [{ name: "Accueil", item: new URL("index.html", `${window.location.origin}/`).href }];
    breadcrumb.querySelectorAll("a").forEach((link) => {
      items.push({ name: link.textContent.trim(), item: new URL(link.getAttribute("href"), window.location.href).href });
    });
    const currentName = document.querySelector("h1")?.textContent.trim();
    if (currentName) {
      items.push({ name: currentName, item: window.location.href });
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

  if (window.location.pathname.includes("/prestations/")) {
    graph.push({
      "@type": "Service",
      name: document.querySelector("h1")?.textContent.replace(/\.$/, "") || title,
      description,
      provider: { "@id": `${window.location.origin}/#organization` },
      areaServed: "France",
      serviceType: "Prestation d'étude technique"
    });
  }

  const script = document.createElement("script");
  script.type = "application/ld+json";
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
