import { useEinsatz } from '../../../hooks/einsatz.hook.js';
import { GenericForm } from './GenericForm.component.js';
import { Alarmstichwort } from '../../../types/app/alarmstichwort.types.js';
import { useMemo } from 'react';
import { ItemType } from '../molecules/Combobox.component.js';
import { useAlarmstichworte } from '../../../hooks/alarmstichworte.hook.js';
import { Einsatz } from '../../../types/app/einsatz.types.js';
import { Button } from '../molecules/Button.component.js';
import { PiDownload, PiStopCircle } from 'react-icons/pi';
import { useModal } from '../../../hooks/modal.hook.js';


interface Einsatzdaten {
  alarmstichwort: string;
}

function FinishEinsatz(props: { einsatz: Einsatz }) {
  const { openModal } = useModal();
  return <>
    <Button
      color="orange"
      icon={PiStopCircle}
      iconPosition="right"
      onClick={() => {
        openModal({
          content: <div>
            <Button
              intent="outline"
              icon={PiDownload}
              onClick={() => {
                console.log('schließe Einsatz ab', props.einsatz);
              }}
            >ETB exportieren</Button>
          </div>,
          title: 'Einsatz abschließen',
          icon: PiStopCircle,
          panelColor: 'green',
          primaryAction: {
            label: 'Einsatz abschließen',
            onClick: () => {
              throw new Error('Einsatz geschlossen');
            },
          },
        });
      }}
    >Einsatz abschließen</Button>
  </>;
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
        updateEinsatz.mutate({ id: einsatz.data!!.id, data });
      }} />

    <FinishEinsatz einsatz={einsatz.data} />
  </section>;
}