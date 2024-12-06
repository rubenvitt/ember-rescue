// @ts-ignore
import { IpPortPair, scanLocalNetworkOnlineHostsByPort } from 'tauri-plugin-network-api';
import { createInvalidateQueries } from '../../utils/queries.js';
import { QueryClient } from '@tanstack/react-query';
import { Configuration, MetaApi } from '@ember-rescue/shared/client/index.js';
import { fetch as tauriFetch } from '@tauri-apps/plugin-http';

// Export des queryKey
export const queryKey = (ip: string, port: number) => ['server', ip, port];

// Invalidate Queries Funktion
export const invalidateQueries = (ip: string, port: number, queryClient: QueryClient) => createInvalidateQueries(queryKey(ip, port), queryClient);

// GET Metadaten von einem lokalen Server
export const fetchLocalServerMeta = {
  queryKey: (ip: string, port: number) => queryKey(ip, port),
  queryFn: function (ip: string, port: number) {
    const api = new MetaApi(
      new Configuration({
        basePath: ip + ':' + port,
        fetchApi: tauriFetch,
      }),
    );

    return api.metaControllerGetMetaV1();
  },
};

// GET Metadaten von einem einzelnen Server
export const fetchSingleServerMeta = {
  queryKey: (url: string) => ['server', url],
  queryFn: function (url: string) {
    const api = new MetaApi(
      new Configuration({
        basePath: url,
        fetchApi: tauriFetch,
      }),
    );

    return api.metaControllerGetMetaV1();
  },
};

// Scan für lokale Netzwerk-Hosts
export const scanLocalNetworkHosts = (port: number = 3000): Promise<IpPortPair[]> => {
  return scanLocalNetworkOnlineHostsByPort({ port });
};
