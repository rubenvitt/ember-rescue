import { ClientOptions, fetch as tauriFetch } from '@tauri-apps/plugin-http';
import storage from './storage.js';
import { Bearbeiter } from '../types.js';
import { isTauri } from '@tauri-apps/api/core';
import { LocalSettings } from '../components/atomic/organisms/PrestartSettings.component.js';

export function ensureSlashBetween(part1: string, part2: string) {
  return `${part1}/${part2}`.replace(/([^:]\/)\/+/g, '$1');
}

export function backendFetch<T>(path: string, init?: RequestInit) {
  const baseUrl = storage().readLocalStorage<LocalSettings>('localSettings');
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
  let fetchPromise;
  if (isTauri()) {
    fetchPromise = path.startsWith('http')
      ? tauriFetch(path, requestInit)
      : tauriFetch(ensureSlashBetween(baseUrl?.baseUrl ?? 'http://localhost:3000', path), requestInit);
  } else {
    fetchPromise = path.startsWith('http')
      ? fetch(path, requestInit)
      : fetch(ensureSlashBetween(baseUrl?.baseUrl ?? 'http://localhost:3000', path), requestInit);
  }

  return fetchPromise.then(async (res) => {
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message);
    }
    return await res.json() as T;
  });
}