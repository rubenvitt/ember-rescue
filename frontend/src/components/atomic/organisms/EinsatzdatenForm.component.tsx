import { useEinsatz } from '../../../hooks/einsatz.hook.js';
import { GenericForm } from './GenericForm.component.js';
import { Alarmstichwort } from '../../../types/app/alarmstichwort.types.js';
import { useMemo } from 'react';
import { ItemType } from '../molecules/Combobox.component.js';
import { useAlarmstichworte } from '../../../hooks/alarmstichworte.hook.js';

interface Einsatzdaten {
  alarmstichwort: Alarmstichwort;
}

export function EinsatzdatenForm(): JSX.Element {
  const { einsatz, updateEinsatz } = useEinsatz();
  const { alarmstichworte } = useAlarmstichworte();
  const stichwortComboItems = useMemo<ItemType<Alarmstichwort>[]>(() => {
    return alarmstichworte.data?.map(item => ({
      item,
      label: item.bezeichnung,
      secondary: item.beschreibung,
    })) ?? [];
  }, [alarmstichworte.data]);

  const defaultStichwort = useMemo<string | undefined>(() => {
    return alarmstichworte.data?.find(a => a.bezeichnung === einsatz.data?.einsatz_alarmstichwort?.bezeichnung)?.id;
  }, [alarmstichworte.data, einsatz.data]);

  if (!einsatz.data || !defaultStichwort) {
    return <>Einsatz laden...</>;
  }

  return <section>
    <h1 className="">Einsatzdaten</h1>
    <GenericForm<Einsatzdaten>
      defaultValues={{
        alarmstichwort: defaultStichwort,
      }}
      sections={[
        {
          title: 'Alarmierung', fields: [{
            name: 'alarmstichwort', label: 'Alarmstichwort', type: 'combo', items: stichwortComboItems,
          }],
        },
      ]}
      onSubmit={(data) => {
        updateEinsatz.mutate({ id: einsatz.data!!.id, data })
      }} />
  </section>;
}