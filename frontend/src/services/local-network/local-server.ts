// @ts-ignore
import { IpPortPair, scanLocalNetworkOnlineHostsByPort } from 'tauri-plugin-network-api';
import { createInvalidateQueries } from '../../utils/queries.js';
import { backendFetchJson } from '../../utils/http.js';

import { ServerMetadata } from '../../types/app/server.types.js';
import { QueryClient } from '@tanstack/react-query';

// Export des queryKey
export const queryKey = (ip: string, port: number) => ['server', ip, port];

// Invalidate Queries Funktion
export const invalidateQueries = (ip: string, port: number, queryClient: QueryClient) =>
  createInvalidateQueries(queryKey(ip, port), queryClient);

// GET Metadaten von einem lokalen Server
export const fetchLocalServerMeta = {
  queryKey: (ip: string, port: number) => queryKey(ip, port),
  queryFn: function (ip: string, port: number) {
    return backendFetchJson<ServerMetadata>(`http://${ip}:${port}/meta`);
  },
};

// GET Metadaten von einem einzelnen Server
export const fetchSingleServerMeta = {
  queryKey: (url: string) => ['server', url],
  queryFn: function (url: string) {
    return backendFetchJson<ServerMetadata>(`${url}/meta`);
  },
};

// Scan für lokale Netzwerk-Hosts
export const scanLocalNetworkHosts = (port: number = 3000): Promise<IpPortPair[]> => {
  return scanLocalNetworkOnlineHostsByPort({ port });
};
