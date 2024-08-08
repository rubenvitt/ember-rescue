import { ClientOptions, fetch as tauriFetch } from '@tauri-apps/plugin-http';
import storage from './storage.js';
import { isTauri } from '@tauri-apps/api/core';
import { LocalSettings } from '../components/atomic/organisms/PrestartSettings.component.js';
import { Bearbeiter } from '../types/app/bearbeiter.types.js';

/**
 * Ensures that there is exactly one slash between two parts of a URL.
 *
 * @param {string} part1 - The first part of the URL.
 * @param {string} part2 - The second part of the URL.
 * @return {string} - The URL with exactly one slash between the parts.
 */
export function ensureSlashBetween(part1: string, part2: string) {
  return `${part1}/${part2}`.replace(/([^:]\/)\/+/g, '$1');
}

/**
 * Sends a request to the backend API and returns the response as JSON.
 *
 * @param {string} path - The path of the API endpoint to fetch.
 * @param {RequestInit} [init] - Optional request configuration options.
 * @returns {Promise<T>} - A Promise that resolves to the response data from the API.
 * @throws {Error} - If the response from the API is not successful.
 */
export async function backendFetch<T>(path: string, init?: RequestInit) {
  const baseUrl = storage().readLocalStorage<LocalSettings>('localSettings')?.baseUrl ?? 'http://localhost:3000';
  const bearbeiter = storage().readLocalStorage<Bearbeiter>('bearbeiter');
  const einsatzId = storage().readLocalStorage<string>('einsatz');
  const backendAccessToken = storage().readLocalStorage<string>('backendAccessToken');
  const additionalHeaders: { Bearbeiter?: string, Einsatz?: string, Authorization?: string } = {};

  if (bearbeiter) additionalHeaders.Bearbeiter = `Bearbeiter-ID: ${bearbeiter.id}`;
  if (einsatzId) additionalHeaders.Einsatz = `Einsatz-ID: ${einsatzId}`;
  if (backendAccessToken) additionalHeaders.Authorization = `AUTH: ${backendAccessToken}`;

  const requestInit: RequestInit & ClientOptions = {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...additionalHeaders,
      ...init?.headers,
    },
  };

  const fetchUrl = path.startsWith('http') ? path : ensureSlashBetween(baseUrl, path);

  const res = await (isTauri() ? tauriFetch(fetchUrl, requestInit) : fetch(fetchUrl, requestInit));

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      const event = new CustomEvent('requestAccessToken');
      window.dispatchEvent(event);
    }

    const error = await res.json();
    throw new Error(error.message);
  }
  return await res.json() as T;
}