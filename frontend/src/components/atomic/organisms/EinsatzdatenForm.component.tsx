import { useEinsatz } from '../../../hooks/einsatz.hook.js';
import { GenericForm } from './GenericForm.component.js';
import { Alarmstichwort } from '../../../types/app/alarmstichwort.types.js';
import { useMemo, useState } from 'react';
import { ItemType } from '../molecules/Combobox.component.js';
import { useAlarmstichworte } from '../../../hooks/alarmstichworte.hook.js';
import { Einsatz } from '../../../types/app/einsatz.types.js';
import { Button } from '../molecules/Button.component.js';
import { PiDownload, PiStopCircle } from 'react-icons/pi';
import { useModal } from '../../../hooks/modal.hook.js';
import { BaseDirectory, writeFile } from '@tauri-apps/plugin-fs';
import { natoDateTime } from '../../../utils/time.js';
import { format } from 'date-fns';


interface Einsatzdaten {
  alarmstichwort: string;
}

function FinishEinsatz(props: { einsatz: Einsatz }) {
  const { openModal } = useModal();
  const [etbExported, setEtbExported] = useState(false);
  return <>
    <Button
      color="orange"
      icon={PiStopCircle}
      iconPosition="right"
      onClick={() => {
        const color = etbExported ? 'green' : 'orange';
        openModal({
          content: <div>
            <Button
              intent="outline"
              color={color}
              icon={PiDownload}
              onClick={async () => {
                try {
                  const response = await fetch('http://localhost:3000/meta/test');

                  if (!response.ok) {
                    throw new Error(`Fehler beim Abrufen der Datei: ${response.statusText}`);
                  }

                  const fileContent = await response.blob();

                  console.log('Größe der heruntergeladenen Datei:', fileContent.size);

                  const arrayBuffer = await fileContent.arrayBuffer();

                  await writeFile(`${props.einsatz.einsatz_alarmstichwort?.bezeichnung}-${format(props.einsatz.beginn, natoDateTime)}.pdf`, new Uint8Array(arrayBuffer), { baseDir: BaseDirectory.Download });
                  console.log('Datei wurde erfolgreich gespeichert.');
                  setEtbExported(true);
                } catch (error) {
                  console.error('Fehler beim Abrufen und Speichern der Datei:', error);
                  setEtbExported(false);
                }
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