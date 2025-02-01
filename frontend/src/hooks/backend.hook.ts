import { useQuery } from '@tanstack/react-query';
import { isTauri } from '@tauri-apps/api/core';
import { fetch as tauriFetch } from '@tauri-apps/plugin-http';
import { useEffect } from 'react';
import { LocalSettings } from '../components/atomic/organisms/PrestartSettings.component.js';
import storage from '../utils/storage.js';

export const useBackend = () => {
  // check that backend is available and running
  const backendPing = useQuery({
    queryKey: ['backend', 'ping'],
    queryFn: async () => {
      const fetchFn = isTauri() ? tauriFetch : fetch;

      const response = await fetchFn((storage().readLocalStorage<LocalSettings>('localSettings')?.baseUrl ?? 'http://localhost:3000') + '/v1/ping', {
        headers: {
          Authorization: `Auth: ${storage().readLocalStorage('backendAccessToken')}`,
        },
      });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          const event = new CustomEvent('requestAccessToken');
          window.dispatchEvent(event);
          throw new Error('Access token invalid');
        }
        throw new Error('Backend not available');
      }
      return response.json();
    },
    retry: true,
    retryOnMount: true,
    refetchIntervalInBackground: true,
    refetchInterval: 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    throwOnError: false,
  });

  useEffect(() => {
    console.log('backend ping failure count', backendPing.failureCount);
  }, [backendPing.failureCount]);

  return {
    isAvailable: backendPing.failureCount < 3,
  };
};

export function resetApp(isAvailable: boolean, removeBearbeiter: () => void) {
  if (!isAvailable) {
    removeBearbeiter();
    window.addEventListener('requestAccessToken', () => {
      window.location.reload();
    });
  }
}
