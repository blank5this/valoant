const STORAGE_KEY = 'valorant-tools-profiles';

export function saveProfiles(profiles) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  } catch (e) {
    console.warn('Failed to save profiles:', e);
  }
}

export function loadProfiles() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.warn('Failed to load profiles:', e);
    return [];
  }
}

export function clearProfiles() {
  localStorage.removeItem(STORAGE_KEY);
}
