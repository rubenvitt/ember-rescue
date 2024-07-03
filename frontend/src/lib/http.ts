import { ClientOptions, fetch } from '@tauri-apps/plugin-http';
import storage from './storage.js';
import { Bearbeiter } from '../types.js';

const BASE_URL = 'http://localhost:3000';

function ensureSlashBetween(part1: string, part2: string) {
  return `${part1}/${part2}`.replace(/([^:]\/)\/+/g, '$1');
}

export function backendFetch(path: string, init?: RequestInit) {
  const bearbeiter = storage().readLocalStorage<Bearbeiter>('bearbeiter');
  const einsatzId = storage().readLocalStorage<string>('einsatz');
  const additonalHeaders: { Bearbeiter?: string, Einsatz?: string } = {};
  if (bearbeiter) additonalHeaders.Bearbeiter = `Bearbeiter-ID: ${bearbeiter.id}`;
  if (einsatzId) additonalHeaders.Einsatz = `Einsatz-ID: ${einsatzId}`;

  const requestInit: RequestInit & ClientOptions = {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...additonalHeaders,
      ...init?.headers,
    },
  };
  const fetchPromise = path.startsWith('http')
    ? fetch(path, requestInit)
    : fetch(ensureSlashBetween(BASE_URL, path), requestInit);

  return fetchPromise.then(async (res) => {
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message);
    }
    return await res.json();
  });
}