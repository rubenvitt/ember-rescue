import React, { useEffect, useMemo, useState } from 'react';
import storage from '../../../utils/storage.js';
import { useQueryClient } from '@tanstack/react-query';
import { useLocalServer } from '../../../hooks/local-network.hook.js';
import { FormLayout } from './form/FormLayout.comonent.js';
import { InputWrapper } from '../atoms/InputWrapper.component.js';
import { AutoComplete } from 'formik-antd';
import { Button } from 'antd';
import { PiClock, PiCloudArrowDown } from 'react-icons/pi';
import { DefaultOptionType } from 'antd/lib/select/index.js';

export type LocalSettings = {
  baseUrl: string;
  baseUrlHistory: string[];
};

export const PrestartSettings: React.FC = () => {
  const localSettings = storage().readLocalStorage<LocalSettings>('localSettings');
  const queryClient = useQueryClient();

  const { localServers } = useLocalServer();
  const [servers, setServers] = useState<DefaultOptionType[]>([]);

  useEffect(() => {
    console.log('setting servers...', localServers);
    setServers(localServers.map(item => ({
      filter: [item.metadata.serverName, item.metadata.serverId, item.url].join(' '),
      label: <div className="flex justify-between"><span>{item.metadata.serverName}</span> <span
        className="truncate">{item.url}</span></div>,
      value: item.url,
      item,
    })));
  }, [localServers]);
  
  useEffect(() => {
    console.log('baseUrl', localSettings?.baseUrlHistory);
  }, [localSettings?.baseUrlHistory]);

  const serverOptions = useMemo(() => {
    return [{
      value: 'http://localhost:3000',
      filter: 'http://localhost:3000' + ' Lokaler Server',
      label: <div className="flex justify-between"><span>Lokaler Server</span> <span
        className="truncate">http://localhost:3000</span></div>,
    }, ...(servers), ...(localSettings?.baseUrlHistory?.map(value => ({ value, history: true })) ?? [])]
      .filter((value, index, array) => array.findIndex(a => a.value === value.value) === index)
      .map((item: DefaultOptionType) => ({
        ...item,
        label: item.history ?
          <span className="text-gray-500"><PiClock className="inline" /> {item.value}</span> : item.label,
      }));
  }, [servers, localSettings?.baseUrlHistory]);

  return (
    <FormLayout<Pick<LocalSettings, 'baseUrl'>> formik={{
      initialValues: {
        baseUrl: localSettings?.baseUrl ?? '',
      },
      onSubmit: async (data) => {
        console.log('save baseUrl...', { data });
        const currentSettings = localSettings ?? { baseUrlHistory: [] };
        const updatedSettings = {
          baseUrl: data.baseUrl,
          baseUrlHistory: [data.baseUrl, ...currentSettings.baseUrlHistory.filter(url => url !== data.baseUrl)],
        };
        storage().writeLocalStorage('localSettings', updatedSettings);
        queryClient.getQueryCache().clear();
        queryClient.removeQueries();
        await queryClient.invalidateQueries({});
      },
    }}>
      {(props) => {
        return (
          <>
            <InputWrapper name="baseUrl" label="URL zum Backend">
              <AutoComplete
                variant='filled'
                // @ts-ignore
                spellCheck={false}
                backfill={true} filterOption={true} optionFilterProp={'filter'}
                options={serverOptions}
                name="baseUrl" />
            </InputWrapper>
            <Button type="primary"
                    onClick={props.submitForm}
                    icon={<PiCloudArrowDown size={24} />}>
              Speichern
            </Button>
          </>
        );
      }}
    </FormLayout>
  );
};