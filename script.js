(function () {
  "use strict";

  const root = document.documentElement;
  const themeButton = document.getElementById("theme-toggle");
  const menuButton = document.getElementById("menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  const progressBar = document.querySelector(".scroll-progress span");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const heroRole = document.querySelector(".hero-role-rotator");
  const firstRoleLine = heroRole && heroRole.querySelector("[data-role-line-one]");
  const secondRoleLine = heroRole && heroRole.querySelector("[data-role-line-two]");
  const heroRoles = [
    { lines: ["Salesforce", "Engineer."] },
    { lines: ["AI", "Engineer."] },
    { lines: ["Software", "Developer."] },
    { lines: ["Quality", "Engineer."] },
    { lines: ["Business", "Analyst."] }
  ];

  function renderHeroRole(index, animate) {
    if (!heroRole || !firstRoleLine || !secondRoleLine) return;
    const role = heroRoles[index];
    const updateRole = function () {
      firstRoleLine.textContent = role.lines[0];
      secondRoleLine.textContent = role.lines[1];
      heroRole.classList.remove("is-changing");
    };

    if (!animate || reduceMotion) {
      updateRole();
      return;
    }

    heroRole.classList.add("is-changing");
    window.setTimeout(updateRole, 260);
  }

  const capabilityTools = Array.from(document.querySelectorAll(".hero-tool[data-tool]"));
  const capabilitySkills = document.querySelector("[data-skill-list]");
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
  let capabilityTimer = 0;
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
    if (capabilityStage) capabilityStage.dataset.activeTool = selected.dataset.tool;
    renderHeroRole(activeCapability, animateCopy);

    if (animateCopy && !reduceMotion && capabilitySkills && capabilitySkills.animate) {
      capabilitySkills.animate([
        { opacity: .25, transform: "translateY(6px)" },
        { opacity: 1, transform: "translateY(0)" }
      ], { duration: 300, easing: "ease-out" });
    }
  }

  function stopCapabilityCycle() {
    if (capabilityTimer) window.clearInterval(capabilityTimer);
    capabilityTimer = 0;
  }

  capabilityTools.forEach(function (tool, index) {
    tool.addEventListener("click", function () {
      stopCapabilityCycle();
      selectCapability(index, true);
    });
    tool.addEventListener("mouseenter", function () { selectCapability(index, true); });
    tool.addEventListener("focus", function () { selectCapability(index, true); });
  });

  selectCapability(0, false);
  if (!reduceMotion && capabilityTools.length) {
    capabilityTimer = window.setInterval(function () {
      if (!document.hidden) selectCapability(activeCapability + 1, true);
    }, 2500);
  }

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

  const learningLoop = document.querySelector("[data-learning-loop]");
  if (learningLoop) {
    const learningSteps = Array.from(learningLoop.querySelectorAll("[data-learning-step]"));
    const learningStage = learningLoop.querySelector(".learning-loop");
    const learningEvidence = learningLoop.querySelector(".learning-evidence");
    const learningProof = learningLoop.querySelector("[data-learning-proof]");
    const learningTitle = learningLoop.querySelector("[data-learning-title]");
    const learningDetail = learningLoop.querySelector("[data-learning-detail]");
    const learningMetric = learningLoop.querySelector("[data-learning-metric]");
    const learningMetricLabel = learningLoop.querySelector("[data-learning-metric-label]");
    const learningTools = learningLoop.querySelector("[data-learning-tools]");
    let learningTimer = 0;

    const learningContent = {
      understand: {
        proof: "REAL PROOF / 01",
        title: "Live CRM at university scale",
        detail: "Mapped stakeholder intent, data risks, and operating constraints before changing live Agentforce and CRM workflows.",
        metric: "100K+",
        metricLabel: "student records supported",
        tools: [
          { label: "Salesforce", icon: "assets/logos/salesforce.svg" },
          { label: "Business analysis" },
          { label: "Agentforce" }
        ]
      },
      learn: {
        proof: "REAL PROOF / 02",
        title: "608 papers. One cited answer.",
        detail: "Researched and assembled a GraphRAG stack that connected NASA publications, extracted relationships, and returned evidence-backed answers.",
        metric: "48h",
        metricLabel: "to build AstraNode from 608 NASA publications",
        tools: [
          { label: "Python", icon: "assets/logos/python.svg" },
          { label: "FastAPI", icon: "assets/logos/fastapi.svg" },
          { label: "Neo4j", icon: "assets/logos/neo4j.svg" },
          { label: "Gemini", icon: "assets/logos/googlegemini.svg" }
        ]
      },
      build: {
        proof: "REAL PROOF / 03",
        title: "Different stacks, one systems mindset",
        detail: "Connected platform logic, streaming data, cloud infrastructure, graph storage, and user-facing results across a deliberately varied project portfolio.",
        metric: "11",
        metricLabel: "verified systems across CRM, AI, cloud, data, and quality",
        tools: [
          { label: "AWS", icon: "assets/logos/amazonwebservices.svg" },
          { label: "Kafka", icon: "assets/logos/apachekafka.svg" },
          { label: "Kubernetes", icon: "assets/logos/kubernetes.svg" },
          { label: "Neo4j", icon: "assets/logos/neo4j.svg" }
        ]
      },
      validate: {
        proof: "REAL PROOF / 04",
        title: "Evidence before polish",
        detail: "Used regression automation, specification testing, telemetry, and measurable acceptance criteria to verify behavior before calling the work complete.",
        metric: "100/100",
        metricLabel: "distributed-systems autograder result",
        tools: [
          { label: "Selenium", icon: "assets/logos/selenium.svg" },
          { label: "pytest", icon: "assets/logos/pytest.svg" },
          { label: "Git", icon: "assets/logos/git.svg" },
          { label: "Telemetry" }
        ]
      },
      improve: {
        proof: "REAL PROOF / 05",
        title: "Measure what changed",
        detail: "Closed the loop with production signals and iteration: faster quotes, lower latency, broader regression coverage, and fewer incidents.",
        metric: "-35%",
        metricLabel: "production incidents; quote time also fell 25%",
        tools: [
          { label: "Salesforce", icon: "assets/logos/salesforce.svg" },
          { label: "Selenium", icon: "assets/logos/selenium.svg" },
          { label: "CI/CD", icon: "assets/logos/git.svg" }
        ]
      }
    };

    function stopLearningSequence() {
      if (learningTimer) window.clearInterval(learningTimer);
      learningTimer = 0;
    }

    function renderLearningTools(tools) {
      const items = tools.map(function (tool) {
        const item = document.createElement("span");
        if (tool.icon) {
          const icon = document.createElement("img");
          icon.src = tool.icon;
          icon.alt = "";
          item.appendChild(icon);
        }
        item.appendChild(document.createTextNode(tool.label));
        return item;
      });
      learningTools.replaceChildren.apply(learningTools, items);
    }

    function selectLearningStep(index, animatePanel) {
      const boundedIndex = Math.max(0, Math.min(index, learningSteps.length - 1));
      const selected = learningSteps[boundedIndex];
      const content = learningContent[selected.dataset.learningStep];

      learningSteps.forEach(function (step, stepIndex) {
        const active = stepIndex === boundedIndex;
        step.classList.toggle("is-active", active);
        step.classList.toggle("is-complete", stepIndex <= boundedIndex);
        step.setAttribute("aria-selected", String(active));
        step.tabIndex = active ? 0 : -1;
      });

      learningStage.style.setProperty("--loop-progress", (boundedIndex / (learningSteps.length - 1) * 100) + "%");
      learningStage.style.setProperty("--loop-accent", selected.style.getPropertyValue("--step-accent"));
      learningEvidence.setAttribute("aria-labelledby", selected.id);
      learningProof.textContent = content.proof;
      learningTitle.textContent = content.title;
      learningDetail.textContent = content.detail;
      learningMetric.textContent = content.metric;
      learningMetricLabel.textContent = content.metricLabel;
      renderLearningTools(content.tools);

      if (animatePanel && !reduceMotion && learningEvidence.animate) {
        learningEvidence.animate([
          { opacity: .4, transform: "translateY(10px)" },
          { opacity: 1, transform: "translateY(0)" }
        ], { duration: 420, easing: "cubic-bezier(.2,.75,.2,1)" });
      }
    }

    learningSteps.forEach(function (step, index) {
      step.id = "learning-step-" + step.dataset.learningStep;
      step.addEventListener("click", function () {
        stopLearningSequence();
        selectLearningStep(index, true);
      });
      step.addEventListener("keydown", function (event) {
        let nextIndex = index;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % learningSteps.length;
        else if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + learningSteps.length) % learningSteps.length;
        else if (event.key === "Home") nextIndex = 0;
        else if (event.key === "End") nextIndex = learningSteps.length - 1;
        else return;

        event.preventDefault();
        stopLearningSequence();
        selectLearningStep(nextIndex, true);
        learningSteps[nextIndex].focus();
      });
    });

    selectLearningStep(0, false);

    if (!reduceMotion && "IntersectionObserver" in window) {
      const learningObserver = new IntersectionObserver(function (entries, observer) {
        if (!entries[0].isIntersecting) return;
        let sequenceIndex = 0;
        learningTimer = window.setInterval(function () {
          sequenceIndex += 1;
          selectLearningStep(sequenceIndex, true);
          if (sequenceIndex === learningSteps.length - 1) stopLearningSequence();
        }, 1350);
        observer.unobserve(learningLoop);
      }, { threshold: .42 });
      learningObserver.observe(learningLoop);
    }
  }

  document.querySelectorAll("[data-mindgraph]").forEach(function (mindgraph) {
    const nodes = mindgraph.querySelectorAll("[data-mindgraph-node]");
    const title = mindgraph.querySelector("[data-mindgraph-title]");
    const stack = mindgraph.querySelector("[data-mindgraph-stack]");
    const detail = mindgraph.querySelector("[data-mindgraph-detail]");
    const detailPanel = mindgraph.querySelector(".mindgraph-detail");

    function selectMindgraphNode(node) {
      const nodeId = node.dataset.mindgraphNode;

      nodes.forEach(function (candidate) {
        const active = candidate === node;
        candidate.classList.toggle("is-active", active);
        candidate.setAttribute("aria-pressed", String(active));
      });

      mindgraph.querySelectorAll("[data-mindgraph-link]").forEach(function (link) {
        link.classList.toggle("is-active", link.dataset.mindgraphLink === nodeId);
      });

      mindgraph.style.setProperty("--mindgraph-active", window.getComputedStyle(node).getPropertyValue("--node-accent").trim());
      title.textContent = node.dataset.title;
      stack.textContent = node.dataset.stack;
      detail.textContent = node.dataset.detail;

      if (!reduceMotion && detailPanel.animate) {
        detailPanel.animate([
          { opacity: .48, transform: "translateY(5px)" },
          { opacity: 1, transform: "translateY(0)" }
        ], { duration: 260, easing: "ease-out" });
      }
    }

    nodes.forEach(function (node) {
      node.addEventListener("click", function () { selectMindgraphNode(node); });
    });

    selectMindgraphNode(mindgraph.querySelector(".mindgraph-node.is-active"));
  });

  document.querySelectorAll("[data-architecture]").forEach(function (architecture) {
    const steps = architecture.querySelectorAll(".architecture-step");
    const title = architecture.querySelector("[data-architecture-title]");
    const detail = architecture.querySelector("[data-architecture-detail]");

    steps.forEach(function (step) {
      step.addEventListener("click", function () {
        steps.forEach(function (candidate) {
          const active = candidate === step;
          candidate.classList.toggle("is-active", active);
          candidate.setAttribute("aria-pressed", String(active));
        });

        title.textContent = step.dataset.title;
        detail.textContent = step.dataset.detail;

        if (!reduceMotion && architecture.querySelector(".architecture-detail").animate) {
          architecture.querySelector(".architecture-detail").animate([
            { opacity: .45, transform: "translateY(5px)" },
            { opacity: 1, transform: "translateY(0)" }
          ], { duration: 260, easing: "ease-out" });
        }
      });
    });
  });

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
  const recommendationCards = Array.from(recommendationTrack.querySelectorAll(".recommendation-card"));
  let recommendationIndex = 0;
  let recommendationScrollFrame = 0;

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
  updateRecommendationControls(0);

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
      if (formData.get("_gotcha")) return;

      const endpoint = contactForm.getAttribute("action") || "";
      const hasFormspreeEndpoint = /^https:\/\/formspree\.io\/f\/[a-z0-9]+$/i.test(endpoint)
        && !endpoint.endsWith("your-form-id");

      if (!hasFormspreeEndpoint) {
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
          body: formData,
          headers: { Accept: "application/json" },
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
