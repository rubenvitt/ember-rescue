export default function storage() {

  function readLocalStorage<TYPE>(key: string): TYPE | null {
    console.debug('Reading from local storage:', key);
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  const writeLocalStorage = (key: string, value: any) => {
    console.debug('Writing to local storage:', key, value);
    localStorage.setItem(key, JSON.stringify(value));
  };

  return {
    readLocalStorage,
    writeLocalStorage,
  };
}