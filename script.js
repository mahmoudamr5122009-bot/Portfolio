const LANG_KEY = "ma_lang";
const THEME_KEY = "ma_theme";

const dirOf = {
  ar: "rtl",
  en: "ltr",
};

let currentLang = localStorage.getItem(LANG_KEY) || "ar";
let currentTheme = localStorage.getItem(THEME_KEY);

function textOf(value) {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object") {
    return value[currentLang] || value.ar || value.en || "";
  }

  return "";
}

function $(selector) {
  return document.querySelector(selector);
}

function $$(selector) {
  return document.querySelectorAll(selector);
}

function createElement(tag, className = "", text = "") {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (text !== "") {
    element.textContent = text;
  }

  return element;
}

function setText(selector, value) {
  const element = $(selector);

  if (element) {
    element.textContent = value ?? "";
  }
}

function setHref(selector, value) {
  const element = $(selector);

  if (element && value) {
    element.href = value;
  }
}

function setAttribute(selector, attribute, value) {
  const element = $(selector);

  if (element && value != null) {
    element.setAttribute(attribute, value);
  }
}

function loadBasicData() {
  const data = window.PORTFOLIO;

  if (!data) {
    console.error("PORTFOLIO data was not found.");
    return;
  }

  const personal = data.personal || {};
  const contact = personal.contact || {};

  setText("#brandName", personal.name);
  setText("#brandRole", textOf(personal.role));

  setText("#footerName", personal.name);
  setText("#footerRole", textOf(personal.role));

  setText("#photoName", personal.name);

  const profileImage = $("#profileImage");
  if (profileImage && personal.photo) {
    profileImage.src = personal.photo.src || "";
    profileImage.alt = textOf(personal.photo.alt);
  }

  const metaDescription = $("#metaDescription");

  if (metaDescription) {
    metaDescription.content = textOf(personal.metaDescription);
  }

  const pageTitle = $("#pageTitle");

  if (pageTitle) {
    pageTitle.textContent =
      currentLang === "ar"
        ? `${personal.name || "Mahmoud Amr"} | بورتفوليو`
        : `${personal.name || "Mahmoud Amr"} | Portfolio`;
  }

  const whatsappNumber = contact.whatsapp || "";

  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${String(whatsappNumber).replace(/\D/g, "")}`
    : "";

  const email = contact.email || "";

  const instagram = contact.instagram || "";

  const facebook = contact.facebook || "";
  const github = contact.github || "";

  // Hero WhatsApp
  setHref("#whatsappLink", whatsappUrl);

  // CTA WhatsApp
  setHref("#ctaWhatsapp", whatsappUrl);

  // Floating WhatsApp
  setHref("#floatingWhatsapp", whatsappUrl);

  // Contact WhatsApp card
  setHref("#contactWhatsapp", whatsappUrl);

  // Phone
  if (whatsappNumber) {
    const cleanPhone = String(whatsappNumber).replace(/\D/g, "");

    setHref("#contactPhone", `tel:+${cleanPhone}`);

    const phoneText = $("#contactPhone strong");

    if (phoneText) {
      phoneText.textContent = formatPhoneNumber(cleanPhone);
    }
  }

  // Email
  if (email) {
    const emailUrl = `mailto:${email}`;

    setHref("#emailLink", emailUrl);
    setHref("#ctaEmail", emailUrl);
    setHref("#contactEmail", emailUrl);

    setText("#contactEmailText", email);
  }

  // Instagram
  if (instagram) {
    setHref("#instagramLink", instagram);
    setHref("#contactInstagram", instagram);
  }

  // Facebook
  if (facebook) {
    setHref("#facebookLink", facebook);
    setHref("#contactFacebook", facebook);
  }

  if (github) {
    setHref("#githubLink", github);
    setHref("#contactGithub", github);
  }

  setText("#year", new Date().getFullYear());
}

function formatPhoneNumber(number) {
  if (!number) {
    return "";
  }

  if (number.startsWith("20") && number.length === 12) {
    return `+${number.slice(0, 2)} ${number.slice(2, 4)} ${number.slice(
      4,
      7,
    )} ${number.slice(7)}`;
  }

  return `+${number}`;
}

function renderHero() {
  const data = window.PORTFOLIO;

  if (!data || !data.hero) {
    return;
  }

  const hero = data.hero;

  setText("#heroTitle", textOf(hero.title));

  setText("#heroRole", textOf(data.personal.role));

  setText("#heroDescription", textOf(hero.description));

  setText("#heroLine", textOf(hero.line));

  const chips = $("#heroChips");

  if (!chips) {
    return;
  }

  chips.innerHTML = "";

  (hero.chips || []).forEach((chip) => {
    chips.appendChild(createElement("span", "chip", textOf(chip)));
  });
}

function renderAbout() {
  const about = window.PORTFOLIO.about;

  if (!about) {
    return;
  }

  setText("#aboutTitle", textOf(about.title));

  setText("#aboutDescription", textOf(about.description));

  const statsContainer = $("#aboutStats");

  if (statsContainer) {
    renderStats(statsContainer, true);
  }

  renderJourney();
}

function renderStats(container, animated = false) {
  if (!container) {
    return;
  }

  container.innerHTML = "";

  const stats = window.PORTFOLIO.stats || {};

  const items = [
    {
      value: stats.modules ?? 0,
      label: {
        ar: "وحدة ومسارًا",
        en: "Modules & tracks",
      },
    },

    {
      value: stats.hours ?? 0,
      label: {
        ar: "ساعة تعلم",
        en: "Learning hours",
      },
    },

    {
      value: stats.tasks ?? 0,
      label: {
        ar: "تكليفًا وتدريبًا",
        en: "Assignments & exercises",
      },
    },

    {
      value: stats.projects ?? 0,
      label: {
        ar: "مشاريع عملية",
        en: "Hands-on projects",
      },
    },
  ];

  items.forEach((item) => {
    const stat = createElement("div", "stat");

    const number = createElement(
      "b",
      animated ? "num" : "",
      animated ? "0" : String(item.value),
    );

    if (animated) {
      number.dataset.target = item.value;
    }

    const label = createElement("span", "", textOf(item.label));

    stat.appendChild(number);
    stat.appendChild(label);

    container.appendChild(stat);
  });
}

function renderJourney() {
  const container = $("#journeyTimeline");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  const journey = window.PORTFOLIO.journey || [];

  journey.forEach((item) => {
    const element = createElement("div", "tl-item");

    const year = createElement("span", "tl-year", textOf(item.year));

    const title = createElement("h3", "", textOf(item.title));

    const description = createElement("p", "", textOf(item.description));

    element.appendChild(year);
    element.appendChild(title);
    element.appendChild(description);

    container.appendChild(element);
  });
}

function renderSkills() {
  const container = $("#skillsGrid");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  const skills = window.PORTFOLIO.skills || [];

  skills.forEach((skill) => {
    const card = createElement("div", "skill-card");

    const number = createElement("span", "skill-num", String(skill.number));

    const title = createElement("h3", "", textOf(skill.title));

    const list = createElement("ul");

    (skill.items || []).forEach((item) => {
      list.appendChild(createElement("li", "", textOf(item)));
    });

    card.appendChild(number);
    card.appendChild(title);
    card.appendChild(list);

    container.appendChild(card);
  });

  renderToolkit();
}

function renderToolkit() {
  const container = $("#toolkit");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  const toolkit = window.PORTFOLIO.toolkit || [];

  toolkit.forEach((item) => {
    container.appendChild(createElement("span", "", textOf(item)));
  });
}

function renderProjects() {
  const container = $("#projectsGrid");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  const projects = window.PORTFOLIO.projects || [];

  projects.forEach((project) => {
    const article = createElement("article", "project-card");

    article.dataset.cat = project.category || "all";

    const thumb = createElement("div", "project-thumb");

    const image = document.createElement("img");

    image.src = project.image || "";

    image.alt = textOf(project.name) || "Project";

    image.loading = "lazy";

    image.decoding = "async";

    thumb.appendChild(image);

    const body = createElement("div", "project-body");

    const category = createElement(
      "span",
      "proj-cat",
      textOf(project.categoryLabel),
    );

    const title = createElement("h3", "", textOf(project.name));

    const tag = createElement("p", "proj-tag", textOf(project.description));

    const points = createElement("ul", "proj-points");

    (project.points || []).forEach((point) => {
      points.appendChild(createElement("li", "", textOf(point)));
    });

    const stats = createElement("div", "proj-stats");

    stats.appendChild(
      projectStat(
        textOf(project.language),
        currentLang === "ar" ? "اللغة" : "Language",
      ),
    );

    stats.appendChild(
      projectStat(
        textOf(project.track),
        currentLang === "ar" ? "المسار" : "Track",
      ),
    );

    if (project.year) {
      stats.appendChild(
        projectStat(
          project.year,
          currentLang === "ar" ? "سنة التنفيذ" : "Year",
        ),
      );
    } else if (project.type) {
      stats.appendChild(
        projectStat(
          textOf(project.type),
          currentLang === "ar" ? "النوع" : "Type",
        ),
      );
    }

    const tags = createElement("div", "tags");

    (project.tags || []).forEach((tag) => {
      tags.appendChild(createElement("span", "", textOf(tag)));
    });

    body.appendChild(category);
    body.appendChild(title);
    body.appendChild(tag);
    body.appendChild(points);
    body.appendChild(stats);
    body.appendChild(tags);

    article.appendChild(thumb);
    article.appendChild(body);

    container.appendChild(article);
  });

  // Apply currently selected filter
  applyProjectFilter();
}

function projectStat(value, label) {
  const div = createElement("div");

  const valueElement = createElement("b", "", value);

  const labelElement = createElement("span", "", label);

  div.appendChild(valueElement);
  div.appendChild(labelElement);

  return div;
}

function renderEducation() {
  const education = window.PORTFOLIO.education;

  if (!education) {
    return;
  }

  setText("#educationTitle", textOf(education.title));

  setText("#educationDescription", textOf(education.description));

  setText("#educationBadge", textOf(education.badge));

  const list = $("#educationPoints");

  if (!list) {
    return;
  }

  list.innerHTML = "";

  (education.points || []).forEach((point) => {
    list.appendChild(createElement("li", "", textOf(point)));
  });
}

function renderCTA() {
  const cta = window.PORTFOLIO.cta;

  if (!cta) {
    return;
  }

  setText("#ctaTitle", textOf(cta.title));

  setText("#ctaDescription", textOf(cta.description));

  const statsContainer = $("#ctaStats");

  if (statsContainer) {
    renderStats(statsContainer, false);
  }
}

function renderContact() {
  const data = window.PORTFOLIO;

  if (!data) {
    return;
  }

  const contact = data.contact || {};

  setText("#contactTitle", textOf(contact.title));

  setText("#contactDescription", textOf(contact.description));

  const personalContact = data.personal?.contact || {};

  const email = personalContact.email || "";

  const whatsapp = personalContact.whatsapp || "";

  const instagram = personalContact.instagram || "";

  const facebook = personalContact.facebook || "";
  const github = personalContact.github || "";

  if (email) {
    setText("#contactEmailText", email);

    setHref("#contactEmail", `mailto:${email}`);
  }

  if (whatsapp) {
    const cleanPhone = String(whatsapp).replace(/\D/g, "");

    const whatsappUrl = `https://wa.me/${cleanPhone}`;

    setHref("#contactWhatsapp", whatsappUrl);

    const whatsappStrong = $("#contactWhatsapp strong");

    if (whatsappStrong) {
      whatsappStrong.textContent = formatPhoneNumber(cleanPhone);
    }
  }

  if (instagram) {
    setHref("#contactInstagram", instagram);
  }

  if (facebook) {
    setHref("#contactFacebook", facebook);
  }

  if (github) {
    setHref("#contactGithub", github);
  }
}

function renderMarquee() {
  const track = $("#marqueeTrack");

  if (!track) {
    return;
  }

  track.innerHTML = "";

  const marquee = window.PORTFOLIO.marquee || [];

  // Duplicate items for continuous animation
  const items = [...marquee, ...marquee];

  items.forEach((item) => {
    track.appendChild(createElement("span", "", textOf(item)));
  });
}

function applyLang(lang) {
  currentLang = lang === "en" ? "en" : "ar";

  document.documentElement.lang = currentLang;

  document.documentElement.dir = dirOf[currentLang];

  const dict = window.I18N?.[currentLang] || {};

  $$("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");

    if (dict[key] != null) {
      element.textContent = dict[key];
    }
  });

  $$("[data-i18n-ph]").forEach((element) => {
    const key = element.getAttribute("data-i18n-ph");

    if (dict[key] != null) {
      element.placeholder = dict[key];
    }
  });

  $$("[data-i18n-aria]").forEach((element) => {
    const key = element.getAttribute("data-i18n-aria");

    if (dict[key] != null) {
      element.setAttribute("aria-label", dict[key]);
    }
  });

  setText("#langBtn", currentLang === "ar" ? "EN" : "ع");

  loadBasicData();
  renderHero();
  renderAbout();
  renderSkills();
  renderProjects();
  renderEducation();
  renderCTA();
  renderContact();
  renderMarquee();

  // Restore active project filter
  updateProjectTabState();

  // Reconnect animations
  setupRevealObserver();

  localStorage.setItem(LANG_KEY, currentLang);
}

function applyTheme(theme) {
  currentTheme = theme === "light" ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", currentTheme);

  setText("#themeBtn", currentTheme === "dark" ? "☀️" : "🌙");

  localStorage.setItem(THEME_KEY, currentTheme);
}

const menuBtn = document.getElementById("menuBtn");

const navLinks = document.getElementById("navLinks");

const menuOverlay = document.getElementById("menuOverlay");

function openMenu() {
  if (!navLinks || !menuBtn) {
    return;
  }

  navLinks.classList.add("open");

  menuOverlay?.classList.add("active");

  menuBtn.classList.add("active");

  menuBtn.setAttribute("aria-expanded", "true");

  document.body.classList.add("menu-open");
}

function closeMenu() {
  if (!navLinks || !menuBtn) {
    return;
  }

  navLinks.classList.remove("open");

  menuOverlay?.classList.remove("active");

  menuBtn.classList.remove("active");

  menuBtn.setAttribute("aria-expanded", "false");

  document.body.classList.remove("menu-open");
}

function toggleMenu() {
  if (!navLinks) {
    return;
  }

  if (navLinks.classList.contains("open")) {
    closeMenu();
  } else {
    openMenu();
  }
}

menuBtn?.addEventListener("click", (event) => {
  event.stopPropagation();
  toggleMenu();
});

menuOverlay?.addEventListener("click", closeMenu);

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("click", (event) => {
  if (!navLinks?.classList.contains("open")) {
    return;
  }

  if (!event.target.closest("#navbar")) {
    closeMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

$("#langBtn")?.addEventListener("click", () => {
  closeMenu();

  const nextLang = currentLang === "ar" ? "en" : "ar";

  applyLang(nextLang);
});

$("#themeBtn")?.addEventListener("click", () => {
  closeMenu();

  applyTheme(currentTheme === "dark" ? "light" : "dark");
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    closeMenu();
  }
});

let revealObserver = null;

function setupRevealObserver() {
  if (revealObserver) {
    revealObserver.disconnect();
  }

  if (!("IntersectionObserver" in window)) {
    $$(".reveal").forEach((element) => {
      element.classList.add("visible");
    });

    return;
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("visible");

        entry.target.querySelectorAll(".num").forEach(animateCount);

        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15,
    },
  );

  $$(
    [
      ".section",
      ".cta-band",
      ".stats-row",
      ".skill-card",
      ".project-card",
      ".tl-item",
    ].join(","),
  ).forEach((element) => {
    element.classList.add("reveal");

    revealObserver.observe(element);
  });
}

function animateCount(element) {
  if (!element || element.dataset.counted === "true") {
    return;
  }

  element.dataset.counted = "true";

  const target = Number(element.dataset.target) || 0;

  if (target <= 0) {
    element.textContent = "0";
    return;
  }

  const duration = 1100;

  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;

    const progress = Math.min(elapsed / duration, 1);

    // Smooth easing
    const eased = 1 - Math.pow(1 - progress, 3);

    const current = Math.floor(eased * target);

    element.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target;
    }
  }

  requestAnimationFrame(update);
}

let activeProjectFilter = "all";

function applyProjectFilter() {
  const cards = $$(".project-card");

  cards.forEach((card) => {
    const category = card.dataset.cat;

    const shouldHide =
      activeProjectFilter !== "all" && category !== activeProjectFilter;

    card.classList.toggle("hidden", shouldHide);
  });

  updateProjectTabState();
}

function updateProjectTabState() {
  $$(".tab").forEach((tab) => {
    const isActive = tab.dataset.filter === activeProjectFilter;

    tab.classList.toggle("active", isActive);

    tab.setAttribute("aria-selected", String(isActive));
  });
}

$("#projectTabs")?.addEventListener("click", (event) => {
  const tab = event.target.closest(".tab");

  if (!tab) {
    return;
  }

  activeProjectFilter = tab.dataset.filter || "all";

  applyProjectFilter();
});

function setupContactLinks() {
  const data = window.PORTFOLIO;

  if (!data) {
    return;
  }

  const contact = data.personal?.contact || {};

  if (contact.whatsapp) {
    const number = String(contact.whatsapp).replace(/\D/g, "");

    const whatsappUrl = `https://wa.me/${number}`;

    setHref("#whatsappLink", whatsappUrl);

    setHref("#ctaWhatsapp", whatsappUrl);

    setHref("#floatingWhatsapp", whatsappUrl);

    setHref("#contactWhatsapp", whatsappUrl);
  }

  if (contact.whatsapp) {
    const number = String(contact.whatsapp).replace(/\D/g, "");

    setHref("#contactPhone", `tel:+${number}`);
  }

  if (contact.email) {
    const emailUrl = `mailto:${contact.email}`;

    setHref("#emailLink", emailUrl);

    setHref("#ctaEmail", emailUrl);

    setHref("#contactEmail", emailUrl);

    setText("#contactEmailText", contact.email);
  }

  if (contact.instagram) {
    setHref("#instagramLink", contact.instagram);

    setHref("#contactInstagram", contact.instagram);
  }

  if (contact.facebook) {
    setHref("#facebookLink", contact.facebook);

    setHref("#contactFacebook", contact.facebook);
  }

  if (contact.github) {
    setHref("#githubLink", contact.github);
    setHref("#contactGithub", contact.github);
  }
}

function setupSmoothScroll() {
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (!href || href === "#" || href.startsWith("#!")) {
        return;
      }

      const target = document.querySelector(href);

      if (!target) {
        return;
      }

      event.preventDefault();

      const navbar = $("#navbar");

      const navbarHeight = navbar ? navbar.offsetHeight : 0;

      const targetTop =
        target.getBoundingClientRect().top + window.scrollY - navbarHeight - 15;

      window.scrollTo({
        top: targetTop,
        behavior: "smooth",
      });

      closeMenu();
    });
  });
}

function setupActiveNav() {
  const sections = $$("section[id]");

  const links = $$(".nav-links a");

  if (!sections.length || !links.length) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const id = entry.target.id;

        links.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${id}`,
          );
        });
      });
    },
    {
      rootMargin: "-30% 0px -60% 0px",
      threshold: 0,
    },
  );

  sections.forEach((section) => {
    observer.observe(section);
  });
}

function setupContactCards() {
  const cards = $$(".contact-card");

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.classList.add("is-hovered");
    });

    card.addEventListener("mouseleave", () => {
      card.classList.remove("is-hovered");
    });
  });
}

function init() {
  if (!currentTheme) {
    currentTheme =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark";
  }

  applyTheme(currentTheme);

  applyLang(currentLang);

  setupContactLinks();

  setupSmoothScroll();

  setupActiveNav();

  setupContactCards();

  document.body.classList.add("page-ready");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
