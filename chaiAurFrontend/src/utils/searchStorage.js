const RECENT_SEARCHES_KEY = "chaiaurfrontend.recentSearches";
const RECENT_SEARCHES_LIMIT = 8;

export const loadRecentSearches = () => {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(RECENT_SEARCHES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
};

export const saveRecentSearches = (searches) => {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(
    RECENT_SEARCHES_KEY,
    JSON.stringify(searches.slice(0, RECENT_SEARCHES_LIMIT))
  );
};

export const buildRecentSearches = (searches, value) => {
  const query = value.trim();
  if (!query) return searches;

  const next = [
    query,
    ...searches.filter((item) => item.toLowerCase() !== query.toLowerCase()),
  ].slice(0, RECENT_SEARCHES_LIMIT);

  saveRecentSearches(next);
  return next;
};
