(function () {
  "use strict";

  const root = document.documentElement;
  const themeButton = document.getElementById("theme-toggle");
  const menuButton = document.getElementById("menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  const progressBar = document.querySelector(".scroll-progress span");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const capabilityTools = Array.from(document.querySelectorAll(".hero-tool[data-tool]"));
  const capabilitySkills = document.querySelector("[data-skill-list]");
  const capabilityModeLabel = document.querySelector("[data-mode-label]");
  const capabilityStage = document.querySelector(".hero");
  const skillLogos = {
    "apex": "salesforce.svg",
    "lwc": "salesforce.svg",
    "cpq": "salesforce.svg",
    "flow": "salesforce.svg",
    "agentforce": "salesforce.svg",
    "crm architecture": "salesforce.svg",
    "python": "python.svg",
    "rag": "langchain.svg",
    "llms": "googlegemini.svg",
    "graphrag": "neo4j.svg",
    "pytorch": "pytorch.svg",
    "evaluation": "pytest.svg",
    "react": "react.svg",
    "javascript": "javascript.svg",
    "apis": "fastapi.svg",
    "java": "openjdk.svg",
    "git": "git.svg",
    "system design": "software-development.svg",
    "aws": "amazonwebservices.svg",
    "docker": "software-development.svg",
    "kubernetes": "kubernetes.svg",
    "kafka": "apachekafka.svg",
    "fastapi": "fastapi.svg",
    "selenium": "selenium.svg",
    "pytest": "pytest.svg",
    "uat": "business-analysis.svg",
    "regression strategy": "pytest.svg",
    "ci": "git.svg",
    "cd": "git.svg",
    "telemetry": "software-development.svg",
    "requirements": "business-analysis.svg",
    "process mapping": "business-analysis.svg",
    "crm": "salesforce.svg",
    "stakeholders": "business-analysis.svg",
    "acceptance criteria": "business-analysis.svg"
  };
  let activeCapability = 0;

  function selectCapability(index, animateCopy) {
    if (!capabilityTools.length) return;
    activeCapability = (index + capabilityTools.length) % capabilityTools.length;
    const selected = capabilityTools[activeCapability];

    capabilityTools.forEach(function (tool, toolIndex) {
      const active = toolIndex === activeCapability;
      tool.classList.toggle("is-active", active);
      tool.setAttribute("aria-pressed", String(active));
    });

    document.querySelectorAll("[data-tool-arrow]").forEach(function (arrow) {
      arrow.classList.toggle("is-active", arrow.dataset.toolArrow === selected.dataset.tool);
    });

    if (capabilitySkills) {
      capabilitySkills.replaceChildren.apply(capabilitySkills, selected.dataset.detail.split("/").map(function (skill) {
        const item = document.createElement("span");
        const label = skill.trim();
        const logo = document.createElement("img");
        logo.src = "assets/logos/" + (skillLogos[label.toLowerCase()] || "software-development.svg");
        logo.alt = "";
        item.append(logo, label);
        return item;
      }));
    }
    if (capabilityModeLabel) capabilityModeLabel.textContent = selected.dataset.title;
    if (capabilityStage) capabilityStage.dataset.activeTool = selected.dataset.tool;

    if (animateCopy && !reduceMotion && capabilitySkills && capabilitySkills.animate) {
      capabilitySkills.animate([
        { opacity: .25, transform: "translateY(6px)" },
        { opacity: 1, transform: "translateY(0)" }
      ], { duration: 300, easing: "ease-out" });
    }
  }

  capabilityTools.forEach(function (tool, index) {
    tool.addEventListener("click", function () {
      selectCapability(index, true);
    });
    tool.addEventListener("focus", function () {
      selectCapability(index, true);
    });
  });

  selectCapability(0, false);

  function setTheme(theme) {
    root.dataset.theme = theme;
    const dark = theme === "dark";
    themeButton.textContent = dark ? "Light" : "Dark";
    themeButton.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    document.querySelector('meta[name="theme-color"]').setAttribute("content", dark ? "#0d1110" : "#f4f2ea");
  }

  const savedTheme = localStorage.getItem("portfolio-theme");
  const initialTheme = savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  setTheme(initialTheme);

  themeButton.addEventListener("click", function () {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("portfolio-theme", nextTheme);
  });

  function closeMenu() {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    mobileNav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }

  menuButton.addEventListener("click", function () {
    const opening = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(opening));
    menuButton.setAttribute("aria-label", opening ? "Close navigation" : "Open navigation");
    mobileNav.classList.toggle("is-open", opening);
    document.body.classList.toggle("menu-open", opening);
  });

  mobileNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  function updateProgress() {
    const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = pageHeight > 0 ? window.scrollY / pageHeight : 0;
    progressBar.style.width = Math.min(100, Math.max(0, progress * 100)) + "%";
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();

  const revealItems = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (item) { item.classList.add("is-visible"); });
  } else {
    const revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -5%" });
    revealItems.forEach(function (item) { revealObserver.observe(item); });
  }

  const projectAtlas = document.querySelector(".project-atlas");
  const projectLibraryToggle = document.getElementById("project-library-toggle");

  if (projectAtlas && projectLibraryToggle) {
    projectLibraryToggle.addEventListener("click", function () {
      const expanded = !projectAtlas.classList.contains("is-expanded");
      projectAtlas.classList.toggle("is-expanded", expanded);
      projectLibraryToggle.setAttribute("aria-expanded", String(expanded));
      projectLibraryToggle.querySelector("span").textContent = expanded
        ? "Show four recruiter-ready systems"
        : "Explore 7 more verified systems";

      if (!expanded) {
        projectAtlas.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      }
    });
  }

  const recommendationTrack = document.getElementById("recommendation-track");
  const recommendationPrev = document.getElementById("recommendation-prev");
  const recommendationNext = document.getElementById("recommendation-next");
  const recommendationPriority = ["Nitya Mathur", "Romil Anand", "Akash Choudhary", "Charanraj P C", "Laura Coulome", "Jhansy Bhogadi"];
  const recommendationCards = Array.from(recommendationTrack.querySelectorAll(".recommendation-card")).sort(function (a, b) {
    return recommendationPriority.indexOf(a.querySelector("figcaption strong").textContent.trim()) - recommendationPriority.indexOf(b.querySelector("figcaption strong").textContent.trim());
  });
  recommendationCards.forEach(function (card, index) {
    recommendationTrack.append(card);
    const number = card.querySelector(".recommendation-number");
    if (number && number.lastChild) number.lastChild.textContent = String(index + 1).padStart(2, "0") + " / " + String(recommendationCards.length).padStart(2, "0");
  });
  let recommendationIndex = 0;
  let recommendationScrollFrame = 0;

  recommendationCards.forEach(function (card, index) {
    const quote = card.querySelector("blockquote");
    if (!quote) return;

    quote.id = "recommendation-quote-" + (index + 1);
    quote.classList.add("is-collapsed");

    const toggle = document.createElement("button");
    toggle.className = "recommendation-expand";
    toggle.type = "button";
    toggle.textContent = "Read full recommendation";
    toggle.setAttribute("aria-controls", quote.id);
    toggle.setAttribute("aria-expanded", "false");
    quote.insertAdjacentElement("afterend", toggle);

    toggle.addEventListener("click", function () {
      const expanded = quote.classList.toggle("is-expanded");
      quote.classList.toggle("is-collapsed", !expanded);
      toggle.textContent = expanded ? "Show less" : "Read full recommendation";
      toggle.setAttribute("aria-expanded", String(expanded));
      window.requestAnimationFrame(function () { sizeRecommendationTrack(index); });
    });
  });

  function recommendationTarget(index) {
    const firstCard = recommendationCards[0];
    const card = recommendationCards[index];
    return card && firstCard ? card.offsetLeft - firstCard.offsetLeft : 0;
  }

  function closestRecommendationIndex() {
    return recommendationCards.reduce(function (closest, card, index) {
      const closestDistance = Math.abs(recommendationTrack.scrollLeft - recommendationTarget(closest));
      const cardDistance = Math.abs(recommendationTrack.scrollLeft - recommendationTarget(index));
      return cardDistance < closestDistance ? index : closest;
    }, 0);
  }

  function sizeRecommendationTrack(index) {
    const card = recommendationCards[index];
    if (!card) return;
    const paddingBottom = parseFloat(window.getComputedStyle(recommendationTrack).paddingBottom) || 0;
    recommendationTrack.style.height = `${Math.ceil(card.getBoundingClientRect().height + paddingBottom)}px`;
  }

  function updateRecommendationControls(index) {
    recommendationIndex = Math.max(0, Math.min(index, recommendationCards.length - 1));
    recommendationPrev.disabled = recommendationIndex === 0;
    recommendationNext.disabled = recommendationIndex === recommendationCards.length - 1;
    recommendationCards.forEach(function (card, cardIndex) {
      card.toggleAttribute("aria-current", cardIndex === recommendationIndex);
    });
    sizeRecommendationTrack(recommendationIndex);
  }

  function showRecommendation(index, behavior) {
    const nextIndex = Math.max(0, Math.min(index, recommendationCards.length - 1));
    recommendationTrack.scrollTo({
      left: recommendationTarget(nextIndex),
      behavior: behavior || (reduceMotion ? "auto" : "smooth"),
    });
    updateRecommendationControls(nextIndex);
  }

  recommendationPrev.addEventListener("click", function () {
    showRecommendation(recommendationIndex - 1);
  });
  recommendationNext.addEventListener("click", function () {
    showRecommendation(recommendationIndex + 1);
  });
  recommendationTrack.addEventListener("scroll", function () {
    cancelAnimationFrame(recommendationScrollFrame);
    recommendationScrollFrame = requestAnimationFrame(function () {
      updateRecommendationControls(closestRecommendationIndex());
    });
  }, { passive: true });
  window.addEventListener("resize", function () {
    showRecommendation(recommendationIndex, "auto");
  });
  function resetRecommendationTrack() {
    showRecommendation(0, "auto");
  }

  resetRecommendationTrack();
  window.addEventListener("pageshow", function () {
    window.requestAnimationFrame(resetRecommendationTrack);
  });

  const contactForm = document.getElementById("contact-form");
  const contactFormStatus = document.getElementById("contact-form-status");

  if (contactForm && contactFormStatus) {
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const submitLabel = submitButton.querySelector("span");

    function setContactStatus(message, isError) {
      contactFormStatus.textContent = message;
      contactFormStatus.classList.toggle("is-error", Boolean(isError));
    }

    contactForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const formData = new FormData(contactForm);
      if (formData.get("_honey")) return;

      const endpoint = contactForm.getAttribute("action") || "";
      const hasLiveEndpoint = /^https:\/\/formsubmit\.co\/ajax\/.+@.+\..+$/i.test(endpoint);

      if (!hasLiveEndpoint) {
        const subject = encodeURIComponent(`Portfolio connection from ${formData.get("name")}`);
        const body = encodeURIComponent([
          `Name: ${formData.get("name")}`,
          `Email: ${formData.get("email")}`,
          `Company: ${formData.get("company") || "Not provided"}`,
          `Reason: ${formData.get("reason")}`,
          "",
          formData.get("message"),
        ].join("\n"));
        setContactStatus("Opening your email app to finish sending.", false);
        window.location.href = `mailto:anubhure98@gmail.com?subject=${subject}&body=${body}`;
        return;
      }

      submitButton.disabled = true;
      submitLabel.textContent = "Sending";
      setContactStatus("Sending your message...", false);

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          body: JSON.stringify(Object.fromEntries(formData.entries())),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Submission failed");

        contactForm.reset();
        setContactStatus("Message sent. I will get back to you soon.", false);
      } catch (error) {
        setContactStatus("The message could not be sent. Please use the direct email link.", true);
      } finally {
        submitButton.disabled = false;
        submitLabel.textContent = "Send message";
      }
    });
  }

})();
