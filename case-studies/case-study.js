(function () {
  "use strict";
  const root = document.documentElement;
  const button = document.getElementById("case-theme");
  const saved = localStorage.getItem("portfolio-theme");
  const initial = saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  function setTheme(theme) {
    root.dataset.theme = theme;
    if (button) {
      button.textContent = theme === "dark" ? "Light" : "Dark";
      button.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    }
  }

  setTheme(initial);
  if (button) button.addEventListener("click", function () {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("portfolio-theme", next);
  });
}());
