try {
  const saved = localStorage.getItem("fwTheme");
  if (saved === "light" || saved === "dark") document.documentElement.dataset.theme = saved;
} catch {}
