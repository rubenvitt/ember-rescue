import { useEffect, useMemo, useState } from 'react';
// @ts-ignore
import { useQueries, UseQueryResult } from '@tanstack/react-query';
import { services } from '../services/index.js';
import { ServerMetadata } from '../types/app/server.types.js';

type IpPortPair = {
  ip: string;
  port: number;
};

export function useLocalServer(singleServer?: string) {
  const [devices, setDevices] = useState<IpPortPair[]>();
  useEffect(() => {
    if (!singleServer) {
      services.localNetwork.localServer.scanLocalNetworkHosts(3000).then((result: IpPortPair[]) => {
        setDevices(result);
        console.log('found devices on local network', { result });
      });
    }
  }, []);

  const queries = useMemo(
    () =>
      devices?.map((device: IpPortPair) => ({
        queryKey: services.localNetwork.localServer.fetchLocalServerMeta.queryKey(device.ip, device.port),
        queryFn: () =>
          services.localNetwork.localServer.fetchLocalServerMeta.queryFn(device.ip, device.port).then((result) => {
            return { id: result.data.serverId, url: `http://${device.ip}:${device.port}`, metadata: result };
          }),
        retry: 2,
      })),
    [devices],
  );

  interface ServerData {
    id: string;
    url: string;
    metadata: ServerMetadata;
  }
  
  const results = useQueries<ServerData[], ServerData[]>({
    queries: singleServer
      ? [{
          queryKey: services.localNetwork.localServer.fetchSingleServerMeta.queryKey(singleServer),
          queryFn: async () => {
            const result = await services.localNetwork.localServer.fetchSingleServerMeta.queryFn(singleServer);
            return {
              id: result.data.serverId,
              url: `http://${singleServer}`,
              metadata: result
            };
          }
        }]
      : (queries ?? []),
    
    combine: (results): ServerData[] => {
      return results
        .filter((result): result is UseQueryResult<ServerData> & { data: ServerData } => 
          result.data !== undefined
        )
        .map(result => result.data)
        .reduce((unique, item) => {
          const exists = unique.some(i => i.id === item.id);
          return exists ? unique : [...unique, item];
        }, [] as ServerData[]);
    }
  });

  return { localServers: results };
}
