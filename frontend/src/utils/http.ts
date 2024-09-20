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

async function makeRequest(
  init:
    | RequestInit
    | undefined
    | {
        body?: BodyInit | null | undefined;
        cache?: RequestCache | undefined;
        credentials?: RequestCredentials | undefined;
        headers?: HeadersInit | undefined;
        integrity?: string | undefined;
        keepalive?: boolean | undefined;
        method?: string | undefined;
        mode?: RequestMode | undefined;
        priority?: RequestPriority | undefined;
        redirect?: RequestRedirect | undefined;
        referrer?: string | undefined;
        referrerPolicy?: ReferrerPolicy | undefined;
        signal?: AbortSignal | null | undefined;
        window?: null | undefined;
      },
  path: string,
) {
  const baseUrl = storage().readLocalStorage<LocalSettings>('localSettings')?.baseUrl ?? 'http://localhost:3000';
  const bearbeiter = storage().readLocalStorage<Bearbeiter>('bearbeiter');
  const einsatzId = storage().readLocalStorage<string>('einsatz');
  const backendAccessToken = storage().readLocalStorage<string>('backendAccessToken');
  const additionalHeaders: { Bearbeiter?: string; Einsatz?: string; Authorization?: string } = {};

  if (bearbeiter) additionalHeaders.Bearbeiter = `Bearbeiter-ID: ${bearbeiter.id}`;
  if (einsatzId) additionalHeaders.Einsatz = `Einsatz-ID: ${einsatzId}`;
  if (backendAccessToken) additionalHeaders.Authorization = `AUTH: ${backendAccessToken}`;

  const requestInit: RequestInit & ClientOptions = {
    ...init,
    headers: {
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

    const error = await res.text();
    throw new Error(error);
  }
  return res;
}

/**
 * Fetches JSON data from the backend server using the specified path and request options.
 *
 * @param {string} path - The path to the JSON resource on the server.
 * @param {RequestInit} [init] - The request options object, which may include headers and other parameters.
 *
 * @returns {Promise<T>} - A promise that resolves to the parsed JSON data from the response body.
 */
export async function backendFetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await makeRequest(
    {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...init?.headers,
      },
    },
    path,
  );
  return (await res.json()) as T;
}

/**
 * Sends a request to the backend server and returns the response body as plain text.
 *
 * @param path - The path of the endpoint to request.
 * @param init - Optional configuration for the request.
 * @returns A Promise that resolves to the response body as plain text.
 */
export async function backendFetchPlainText(path: string, init?: RequestInit): Promise<string> {
  const res = await makeRequest(init, path);
  return await res.text();
}

/**
 * Sends a request to the backend server and returns the response as a Blob.
 *
 * @param path - The path of the endpoint to request.
 * @param init - Optional configuration for the request.
 * @returns A Promise that resolves to the response as a Blob.
 */
export async function backendFetchBlob(path: string, init?: RequestInit): Promise<Blob> {
  const res = await makeRequest(init, path);
  return await res.blob();
}
