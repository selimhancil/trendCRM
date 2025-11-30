/**
 * Theme Management
 * Dark mode ve tema yönetimi için utility fonksiyonlar
 */

export const getTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") return "light";
  
  const saved = localStorage.getItem("theme");
  if (saved) {
    return saved as "light" | "dark";
  }
  
  // System preference
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  
  return "light";
};

export const setTheme = (theme: "light" | "dark") => {
  if (typeof window === "undefined") return;
  
  localStorage.setItem("theme", theme);
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(theme);
};

export const initTheme = () => {
  if (typeof window === "undefined") return;
  
  const theme = getTheme();
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(theme);
};

// Apply theme on load
if (typeof window !== "undefined") {
  initTheme();
}




