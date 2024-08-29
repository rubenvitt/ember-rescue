export default function storage() {

  function readLocalStorage<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) as T : null;
  }

  function writeLocalStorage<T>(key: string, value: T) {
    console.debug('Writing to local storage:', key, value);
    if (value === null || value === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  return {
    readLocalStorage,
    writeLocalStorage,
  };
}