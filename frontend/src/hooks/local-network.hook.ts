import { useEffect, useMemo, useState } from 'react';
// @ts-ignore
import { IpPortPair, scanLocalNetworkOnlineHostsByPort } from 'tauri-plugin-network-api';
import { useQueries, UseQueryResult } from '@tanstack/react-query';
import { services } from '../services/index.js';
import { ServerMetadata } from '../types/app/server.types.js';

export function useLocalServer(singleServer?: string) {
  const [devices, setDevices] = useState<IpPortPair>();
  useEffect(() => {
    if (!singleServer) {
      services.localNetwork.localServer.scanLocalNetworkHosts(3000).then((result: IpPortPair[]) => {
        setDevices(result);
        console.log(result);
      });
    }
  }, []);

  const queries = useMemo(
    () => devices?.map((device: IpPortPair) => ({
      queryKey: services.localNetwork.localServer.fetchLocalServerMeta.queryKey(device.ip, device.port),
      queryFn: () => services.localNetwork.localServer.fetchLocalServerMeta.queryFn(device.ip, device.port)
        .then((result) => {
          return { id: result.serverId, url: `http://${device.ip}:${device.port}`, metadata: result };
        }),
      retry: 2,
    })),
    [devices],
  );

  const results = useQueries<{
    id: string;
    url: string;
    metadata: ServerMetadata
  }[], { id: string; url: string; metadata: ServerMetadata }[]>({
    queries: singleServer ? [
      {
        queryKey: services.localNetwork.localServer.fetchSingleServerMeta.queryKey(singleServer),
        queryFn: () => services.localNetwork.localServer.fetchSingleServerMeta.queryFn(singleServer)
          .then((result) => {
            return { id: result.serverId, url: `http://${singleServer}`, metadata: result };
          }),
      },
    ] : queries ?? [],
    // @ts-ignore
    combine: (results: UseQueryResult<{ id: string; url: string; metadata: ServerMetadata }>[],
    ): { id: string; url: string; metadata: ServerMetadata }[] => {
      return [
        ...new Map(
          results.filter((result) => result.data?.id).map((result) => [result.data!.id, result.data]),
        ).values(),
      ].filter((x) => !!x);
    },
  });

  return { localServers: results };
}