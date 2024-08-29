import { useEinsatz } from '../../../hooks/einsatz.hook.js';
import { useMemo, useState } from 'react';
import { useAlarmstichworte } from '../../../hooks/alarmstichworte.hook.js';
import { Einsatz } from '../../../types/app/einsatz.types.js';
import { PiCheck, PiConfetti, PiDownload, PiStopCircle, PiX } from 'react-icons/pi';
import { BaseDirectory, writeFile } from '@tauri-apps/plugin-fs';
import { natoDateTime } from '../../../utils/time.js';
import { format } from 'date-fns';
import { backendFetchBlob } from '../../../utils/http.js';
import { isTauri } from '@tauri-apps/api/core';
import { Button, ConfigProvider, Modal, Tooltip } from 'antd';
import { FormLayout } from './form/FormLayout.comonent.js';
import { FormSection } from './form/FormSection.component.js';
import { FormContentBox } from './form/FormContentBox.component.js';
import { InputWrapper } from '../atoms/InputWrapper.component.js';
import { Select } from 'formik-antd';
import { DefaultOptionType } from 'antd/lib/select/index.js';

interface Einsatzdaten {
  alarmstichwort: string;
}

function FinishEinsatz(props: { einsatz: Einsatz }) {
  const [etbExported, setEtbExported] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const color = etbExported ? 'green' : 'orange';

  return <>
    <Button
      color="orange"
      icon={<PiStopCircle />}
      type="dashed"
      iconPosition="end"
      onClick={() => {
        setModalOpen(true);
      }}
    >Einsatz abschließen</Button>

    <Modal open={modalOpen} onCancel={() => setModalOpen(false)}
           classNames={{
             wrapper: 'bg-primary-600/75',
           }}
           maskClosable={false}
           closable={false}
           cancelButtonProps={{ icon: <PiX />, iconPosition: 'end' }}
           okText="Abschließen"
           okButtonProps={{ icon: <PiConfetti />, iconPosition: 'end' }}
           title="Einsatz abschließen">
      <div>

        <ConfigProvider theme={{
          components: {
            Button: { colorText: color, colorPrimaryHover: color },
          },
        }}>
          <Button
            icon={etbExported ? <PiCheck /> : <PiDownload />}
            iconPosition="end"
            loading={exporting}
            onClick={async () => {
              setExporting(true);
              try {
                const fileContent = await backendFetchBlob('/export/pdf');
                const fileName = `${props.einsatz.einsatz_alarmstichwort?.bezeichnung}-${format(props.einsatz.beginn, natoDateTime)}.pdf`;
                if (isTauri()) {
                  console.log('Größe der heruntergeladenen Datei:', fileContent.size);
                  const arrayBuffer = await fileContent.arrayBuffer();
                  await writeFile(fileName, new Uint8Array(arrayBuffer), { baseDir: BaseDirectory.Download });
                  console.log('Datei wurde erfolgreich gespeichert.');
                } else {
                  // browser download:
                  try {
                    // Erstellt eine URL für den Blob
                    const url = window.URL.createObjectURL(fileContent);

                    // Erstellt ein verstecktes a-Element und simuliert einen Klick darauf
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click();

                    // Entfernt das a-Element und die Blob-URL
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                  } catch (error) {
                    console.error('Fehler beim Herunterladen des Blobs:', error);
                  }
                }
                setEtbExported(true);
              } catch (error) {
                console.error('Fehler beim Abrufen und Speichern der Datei:', error);
                setEtbExported(false);
              } finally {
                setExporting(false);
              }
            }}
          >{etbExported ? 'ETB exportiert' : 'ETB exportieren'}</Button>
        </ConfigProvider>
      </div>
    </Modal>
  </>;
}

export function EinsatzdatenForm(): JSX.Element {
  const { einsatz, updateEinsatz } = useEinsatz();
  const { alarmstichworte } = useAlarmstichworte();

  const alarmstichworteItems = useMemo<DefaultOptionType[]>(() => {
    return alarmstichworte.data?.map(item => ({
      item,
      label: <div className="flex justify-between gap-4">
        <span>{item.bezeichnung}</span>
        <Tooltip title={item.beschreibung}>
          <span className="truncate">{item.beschreibung}</span>
        </Tooltip>
      </div>,
      value: item.id,
    } satisfies DefaultOptionType)) ?? [];
  }, [alarmstichworte.data]);

  const defaultStichwort = useMemo<string | undefined>(() => {
    return alarmstichworte.data?.find(a => a.bezeichnung === einsatz.data?.einsatz_alarmstichwort?.bezeichnung)?.id;
  }, [alarmstichworte.data, einsatz.data]);

  if (!einsatz.data || !defaultStichwort) {
    return <>Einsatz laden...</>;
  }

  return <section>
    <h1 className="">Einsatzdaten</h1>
    <FormLayout<Einsatzdaten>
      type="sectioned" formik={{
      initialValues: {
        alarmstichwort: defaultStichwort,
      },
      onSubmit: (data) => {
        console.log('submitting einsatzdaten', { data });
        updateEinsatz.mutate({ id: einsatz.data!!.id, data });
      },
    }} form={{ className: 'space-y-4' }}
    >
      {(props) => (
        <>
          <FormSection heading="Alarmierung">
            <FormContentBox>
              <InputWrapper name="alarmstichwort">
                <Select name="alarmstichwort" loading={alarmstichworte.isLoading} options={alarmstichworteItems} />
              </InputWrapper>
            </FormContentBox>
          </FormSection>
          <Button onClick={props.submitForm} type="primary" htmlType="submit">
            Speichern
          </Button>
        </>
      )}
    </FormLayout>
    <FinishEinsatz einsatz={einsatz.data} />
  </section>;
}