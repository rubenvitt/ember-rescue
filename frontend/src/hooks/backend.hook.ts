import { useQuery } from '@tanstack/react-query';
import { fetch } from '@tauri-apps/plugin-http';
import storage from '../utils/storage.js';
import { LocalSettings } from '../components/atomic/organisms/PrestartSettings.component.js';
import { useEffect } from 'react';

export const useBackend = () => {
  // check that backend is available and running
  const backendPing = useQuery({
    queryKey: ['backend', 'ping'],
    queryFn: async () => {
      const response = await fetch((storage().readLocalStorage<LocalSettings>('localSettings')?.baseUrl ?? 'http://localhost:3000') + '/v1/ping', {});
      if (!response.ok) {
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
