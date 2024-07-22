import { useEffect, useMemo, useState } from 'react';
// @ts-ignore
import { IpPortPair, scanLocalNetworkOnlineHostsByPort } from 'tauri-plugin-network-api';
import { backendFetch } from '../utils/http.js';
import { ServerMetadata } from '../types/types.js';
import { QueryOptions, useQueries, UseQueryResult } from '@tanstack/react-query';

export function useLocalServer(singleServer?: string) {
  const [devices, setDevices] = useState<IpPortPair>();
  useEffect(() => {
    if (!singleServer) {
      scanLocalNetworkOnlineHostsByPort({
        port: 3000,
      }).then((result: IpPortPair) => {
        setDevices(result);
        console.log(result);
      });
    }
  }, []);
  const queries = useMemo(
    () => devices?.map((device: IpPortPair) => ({
      queryKey: ['server', device.ip, device.port],
      queryFn: () => backendFetch<ServerMetadata>(`http://${device.ip}:${device.port}/meta`)
        .then((result) => {
          return { id: result.serverId, url: 'http://' + device.ip + ':' + device.port, metadata: result };
        })
        .catch(e => {
          console.log('error while fetching', e);
          throw e;
        }),
      retry: 2,
    }) as QueryOptions),
    [devices],
  );

  const results = useQueries<{ id: string, url: string, metadata: ServerMetadata }[], {
    id: string,
    url: string,
    metadata: ServerMetadata
  }[]>({
    queries: singleServer ? {
      queryKey: ['server', singleServer],
      queryFn: () => backendFetch<ServerMetadata>(singleServer + '/meta')
        .then((result) => {
          return { id: result.serverId, url: 'http://' + singleServer, metadata: result };
        })
        .catch(e => {
          console.log('error while fetching', e);
          throw e;
        }),
    } as QueryOptions : queries ?? [],
    // @ts-ignore
    combine: (results: UseQueryResult<{ id: string, url: string, metadata: ServerMetadata }>[]): {
      id: string,
      url: string,
      metadata: ServerMetadata
    }[] => {
      console.log('combining', results);
      return [...new Map(results.filter((result) => result.data?.id).map(result => [result.data!.id, result.data])).values()].filter(x => !!x);
    },
  });

  return { localServers: results };
}