const FAVORITES_KEY = "library_favorites";
const THEME_KEY = "library_theme";

export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  } catch {
    return [];
  }
}

export function setFavorites(favorites) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export function addFavorite(book) {
  const list = getFavorites();
  if (!list.find((b) => b.key === book.key)) {
    list.push(book);
    setFavorites(list);
  }
  return list;
}

export function removeFavorite(key) {
  const list = getFavorites().filter((b) => b.key !== key);
  setFavorites(list);
  return list;
}

export function isFavorite(key) {
  return getFavorites().some((b) => b.key === key);
}

export function getSavedTheme() {
  return localStorage.getItem(THEME_KEY) || "light";
}

export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}
