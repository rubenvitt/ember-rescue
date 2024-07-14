import { GenericForm } from './GenericForm.component.js';
import storage from '../../../lib/storage.js';
import { useEffect, useMemo, useState } from 'react';
// @ts-ignore
import { IpPortPair, scanLocalNetworkOnlineHostsByPort } from 'tauri-plugin-network-api';
import { backendFetch } from '../../../lib/http.js';
import { QueryOptions, useQueries, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { ServerMetadata } from '../../../types.js';
import { ItemType } from '../molecules/Combobox.component.js';

export type LocalSettings = {
  baseUrl: string,
  baseUrlHistory: string[]
}

function useLocalServer(singleServer?: string) {
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
    combine: (results: UseQueryResult<{ id: string, url: string, metadata: ServerMetadata }>[]) => {
      console.log('combining', results);
      return [...new Map(results.filter((result) => result.data?.id).map(result => [result.data!!.id, result.data])).values()];
    },
  });

  return { localServers: results };
}

export function PrestartSettings() {
  const localSettings = storage().readLocalStorage<LocalSettings>('localSettings');
  const { localServers } = useLocalServer();
  const [servers, setServers] = useState<ItemType<{ id: string, url: string, metadata?: ServerMetadata }>[]>([]);
  const { invalidateQueries, getQueryCache, removeQueries } = useQueryClient();

  useEffect(() => {
    console.log('setting servers...', localServers);
    setServers(localServers.map(item => ({
      label: item.metadata.serverName,
      secondary: item.url,
      item,
    })));
  }, [localServers]);

  return <>
    <GenericForm<LocalSettings>
      defaultValues={localSettings ?? {
        baseUrl: 'http://localhost:3000',
        baseUrlHistory: [],
      }}
      onSubmit={(data) => {
        console.log('searching', data, servers);
        const newUrl = servers.find(server => server.item.id === data.baseUrl)?.item?.url ?? data.baseUrl;
        console.log('using new url', newUrl);

        const currentSettings = localSettings ?? { baseUrlHistory: [] };
        const updatedSettings = {
          baseUrl: newUrl,
          baseUrlHistory: [newUrl, ...(currentSettings.baseUrlHistory ?? []).filter(url => url !== newUrl)],
        };
        console.log('saving items', updatedSettings);
        storage().writeLocalStorage('localSettings', updatedSettings);
        getQueryCache().clear();
        removeQueries();
        invalidateQueries({
          queryKey: ['bearbeiter'],
        });
      }}
      sections={[{
        title: 'Backend API',
        fields: [{
          name: 'baseUrl',
          type: 'combo',
          label: 'URL zur Backend API',
          items: servers ?? [],
          allowNewValues: true,
          onAddNewValue: (val) => {
            console.log('added', val);
            setServers((prev) => [...(prev?.filter(item => item.item.id !== 'custom') ?? []), {
              label: val,
              item: { id: 'custom', url: val },
            }]);
          },
          width: 'full',
        }],
      }]} />
  </>;
}