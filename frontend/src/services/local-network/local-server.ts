// @ts-ignore
import { IpPortPair, scanLocalNetworkOnlineHostsByPort } from 'tauri-plugin-network-api';
import { createInvalidateQueries } from '../../utils/queries.js';
import { backendFetch } from '../../utils/http.js';

import { ServerMetadata } from '../../types/app/server.types.js';

// Export des queryKey
export const queryKey = (ip: string, port: number) => ['server', ip, port];

// Invalidate Queries Funktion
export const invalidateQueries = (ip: string, port: number) => createInvalidateQueries([queryKey(ip, port)]);

// GET Metadaten von einem lokalen Server
export const fetchLocalServerMeta = {
  queryKey: (ip: string, port: number) => queryKey(ip, port),
  queryFn: function(ip: string, port: number) {
    return backendFetch<ServerMetadata>(`http://${ip}:${port}/meta`);
  },
};

// GET Metadaten von einem einzelnen Server
export const fetchSingleServerMeta = {
  queryKey: (url: string) => ['server', url],
  queryFn: function(url: string) {
    return backendFetch<ServerMetadata>(`${url}/meta`);
  },
};

// Scan für lokale Netzwerk-Hosts
export const scanLocalNetworkHosts = (port: number = 3000): Promise<IpPortPair[]> => {
  return scanLocalNetworkOnlineHostsByPort({ port });
};