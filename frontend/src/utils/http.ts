import { Configuration, FetchParams, RequestContext } from '@bluelight-hub/shared/client';
import { isTauri } from '@tauri-apps/api/core';
import { ClientOptions, fetch as tauriFetch } from '@tauri-apps/plugin-http';
import { LocalSettings } from '../components/atomic/organisms/PrestartSettings.component.js';
import { Bearbeiter } from '../types/app/bearbeiter.types.js';
import storage from './storage.js';

export function getAPIConfig(): Configuration {
  return new Configuration({
    basePath: storage().readLocalStorage<LocalSettings>('localSettings')?.baseUrl ?? 'http://localhost:3000',
    fetchApi: isTauri() ? tauriFetch : fetch,
    middleware: [
      {
        pre(context: RequestContext): Promise<FetchParams | void> {
          const backendAccessToken = storage().readLocalStorage<string>('backendAccessToken');
          return Promise.resolve({
            url: context.url,
            init: {
              ...context.init,
              headers: {
                ...context.init.headers,
                bearbeiter: storage().readLocalStorage<Bearbeiter>('bearbeiter')?.name ?? '',
                ...(backendAccessToken ? { Authorization: `Bearer ${backendAccessToken}` } : {}),
              },
            },
          });
        },
      },
    ],
  });
}

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
 * @deprecated Use generated client/api instead
 * @param init
 * @param path
 */
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
  const einsatzId = storage().readLocalStorage<string>('mission');
  const backendAccessToken = storage().readLocalStorage<string>('backendAccessToken');
  const additionalHeaders: { Bearbeiter?: string; Einsatz?: string; Authorization?: string } = {};

  if (bearbeiter) additionalHeaders.Bearbeiter = `Bearbeiter: ${bearbeiter.name}`;
  if (einsatzId) additionalHeaders.Einsatz = `Einsatz-ID: ${einsatzId}`;
  if (backendAccessToken) additionalHeaders.Authorization = `Bearer ${backendAccessToken}`;

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
 * Sends a request to the backend server and returns the response as a Blob.
 *
 * @param path - The path of the endpoint to request.
 * @param init - Optional configuration for the request.
 * @returns A Promise that resolves to the response as a Blob.
 *
 * @deprecated
 */
export async function backendFetchBlob(path: string, init?: RequestInit): Promise<Blob> {
  const res = await makeRequest(init, path);
  return await res.blob();
}
