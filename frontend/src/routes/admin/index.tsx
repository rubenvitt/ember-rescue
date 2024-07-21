import { createFileRoute } from '@tanstack/react-router';
import { GenericForm } from '../../components/atomic/organisms/GenericForm.component.js';
import { Settings, useSettings } from '../../hooks/settings.hook.js';
import { ListForm } from '../../components/atomic/organisms/ListForm.component.js';
import { EinheitDto, EinheitTypDto } from '../../types/types.js';
import { useEinheiten } from '../../hooks/einheiten/einheiten.hook.js';
import { useMemo } from 'react';
import { ItemType } from '../../components/atomic/molecules/Combobox.component.js';
import { IpPortPair } from 'tauri-plugin-network-api/dist-js/types.js';
import { useQuery } from '@tanstack/react-query';
import { backendFetch } from '../../utils/http.js';

export const Route = createFileRoute('/admin/')({
  component: AdminPage,
});

const einheitTemplate: Pick<EinheitDto, 'id' | 'funkrufname' | 'kapazitaet' | 'istTemporaer' | 'einheitTyp'> = {
  id: '',
  funkrufname: '',
  einheitTyp: {
    label: 'RTW',
    id: '',
  },
  kapazitaet: 2,
  istTemporaer: false,
};

function DeviceOption({ device }: { device: IpPortPair }) {
  const serverInfo = useQuery<{ version: string, serverName: string, serverId: string }>({
    queryFn: () => backendFetch('http://' + device.ip + ':' + device.port + '/meta').catch(e => {
      console.log('error while fetching', e);
      throw e;
    }),
    queryKey: ['server', JSON.stringify(device)],
  });

  return <option key={device.ip}>{JSON.stringify(serverInfo.data)}</option>;
}

function AdminPage() {
  const { settings, save } = useSettings();
  const { einheiten, einheitenTypen, patchEinheiten } = useEinheiten();

  const einheitTypenComboItems = useMemo<ItemType<EinheitTypDto>[]>(() => {
    return (einheitenTypen.data ?? []).map(item => ({
      item,
      label: item.label,
      secondary: item.description,
    }));
  }, [einheitenTypen.data]);

  const einheitenTableDtos = useMemo(() => {
    return einheiten.data?.map(({ id, funkrufname, einheitTyp, kapazitaet, istTemporaer }) => ({
      id,
      funkrufname,
      einheitTyp,
      kapazitaet,
      istTemporaer,
    })) ?? [];
  }, [einheiten.data]);


  if (!settings.isFetchedAfterMount || !settings.data) return null;

  return (
    <div className="p-6">
      <GenericForm<Settings>
        defaultValues={{ ...settings.data }}
        submitText="Änderungen speichern"
        onSubmit={(data) => {
          save.mutate(data);
        }}
        layout="complex"
        sections={[
          {
            title: 'API-Keys',
            fields: [
              {
                name: 'mapboxApi',
                type: 'text',
                label: 'Mapbox API Key',
              },
            ],
          },
        ]} />

      {einheiten.data &&
        <ListForm<typeof einheitTemplate>
          sections={[{
            fields: [
              {
                name: 'istTemporaer',
                type: 'checkbox',
                label: 'Temporäre Einheit',
              },
              {
                name: 'id',
                type: 'text',
                readonly: true,
                label: 'ID',
              },
              {
                name: 'einheitTyp',
                label: 'Art der Einheit',
                type: 'combo',
                items: einheitTypenComboItems,
              },
              {
                name: 'kapazitaet',
                label: 'Kapazität (Einsatzkräfte)',
                type: 'number',
              },
            ],
          }]}
          itemTemplate={einheitTemplate} items={einheitenTableDtos}
          onItemsChange={(items) => {
            patchEinheiten.mutate(items.map(item => ({
              ...item,
              kapazitaet: Number(item.kapazitaet),
              // @ts-ignore
              einheitTypId: item.einheitTyp.id ?? item.einheitTyp,
            })));
          }}
          layout={'simple'}
          renderFunctions={{
            einheitTyp: (einheitTyp) => einheitTyp.label,
          }}
        />}
    </div>
  );
}