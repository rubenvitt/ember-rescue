import React, { useEffect, useState } from 'react';
import { GenericForm } from './GenericForm.component.js';
import storage from '../../../utils/storage.js';
import { useQueryClient } from '@tanstack/react-query';
import { useLocalServer } from '../../../hooks/local-network.hook.js';
import { ItemType } from '../molecules/Combobox.component.js';
import { ServerMetadata } from '../../../types/app/server.types.js';
import { useModal } from '../../../hooks/modal.hook.js';

export type LocalSettings = {
  baseUrl: string;
  baseUrlHistory: string[];
};

export const PrestartSettings: React.FC = () => {
  const localSettings = storage().readLocalStorage<LocalSettings>('localSettings');
  const queryClient = useQueryClient();

  const { localServers } = useLocalServer();
  const [servers, setServers] = useState<ItemType<{ id: string, url: string, metadata?: ServerMetadata }>[]>([]);
  const { closeModal, openModal } = useModal();

  useEffect(() => {
    console.log('setting servers...', localServers);
    setServers(localServers.map(item => ({
      label: item.metadata.serverName,
      secondary: item.url,
      item,
    })));
  }, [localServers]);

  useEffect(() => {
    const handleRequestAccessToken = () => {
      openModal({
        title: 'Access Token',
        content: <GenericForm<{ accessToken: string }>
          onSubmit={(data) => {
            storage().writeLocalStorage('backendAccessToken', data.accessToken);
            closeModal();
          }}
          field={{
            label: 'Access Token Required',
            name: 'accessToken',
            type: 'password',
          }}
        />,
      });
    };

    window.addEventListener('requestAccessToken', handleRequestAccessToken);
    return () => {
      window.removeEventListener('requestAccessToken', handleRequestAccessToken);
    };
  }, []);

  const handleSubmit = (data: LocalSettings) => {
    const newUrl = servers.find(server => server.item.id === data.baseUrl)?.item?.url ?? data.baseUrl;
    const currentSettings = localSettings ?? { baseUrlHistory: [] };
    const updatedSettings = {
      baseUrl: newUrl,
      baseUrlHistory: [newUrl, ...currentSettings.baseUrlHistory.filter(url => url !== newUrl)],
    };
    storage().writeLocalStorage('localSettings', updatedSettings);
    queryClient.getQueryCache().clear();
    queryClient.removeQueries();
    queryClient.invalidateQueries({ queryKey: ['bearbeiter'] });
  };

  return (
    <GenericForm<LocalSettings>
      defaultValues={localSettings ?? { baseUrl: 'http://localhost:3000', baseUrlHistory: [] }}
      onSubmit={handleSubmit}
      sections={[{
        title: 'Backend API',
        fields: [{
          name: 'baseUrl',
          type: 'combo',
          label: 'URL zur Backend API',
          items: servers,
          allowNewValues: true,
          onAddNewValue: (val) => {
            setServers((prev) => [...(prev?.filter(item => item.item.id !== 'custom') ?? []), {
              label: val,
              item: { id: 'custom', url: val },
            }]);
          },
          width: 'full',
        }],
      }]}
    />
  );
};