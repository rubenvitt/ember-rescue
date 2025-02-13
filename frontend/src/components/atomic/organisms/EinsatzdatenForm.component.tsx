import { MissionDto, SecretsDto, UpdateMissionDto } from '@bluelight-hub/shared/client/index.js';
import { isTauri } from '@tauri-apps/api/core';
import { BaseDirectory, writeFile } from '@tauri-apps/plugin-fs';
import { Button, ConfigProvider, DatePicker, Form, Modal, Select, Tooltip } from 'antd';
import { DefaultOptionType } from 'antd/lib/select/index.js';
import { format } from 'date-fns';
import dayjs, { Dayjs } from 'dayjs';
import { useMemo, useReducer, useState } from 'react';
import { PiCheck, PiConfetti, PiDownload, PiStopCircle, PiX } from 'react-icons/pi';
import { useAlarmstichworte } from '../../../hooks/alarmstichworte.hook.js';
import { useEinsatz } from '../../../hooks/einsatz.hook.js';
import { RangeValue } from '../../../types/ui/inputs.types.js';
import { backendFetchBlob } from '../../../utils/http.js';
import { natoDateTime, natoDateTimeAnt } from '../../../utils/time.js';
import { InputWrapper } from '../atoms/InputWrapper.component.js';
import { AddressAutocomplete } from '../molecules/AddressAutocomplete.component.js';
import { FormContentBox } from './form/FormContentBox.component.js';
import { FormLayout } from './form/FormLayout.comonent.js';
import { FormSection } from './form/FormSection.component.js';

type UpdateMissionFormData = UpdateMissionDto & {
  timeframe: [Dayjs, Dayjs];
};

function FinishEinsatz(props: { einsatz: MissionDto }) {
  const [etbExported, setEtbExported] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const color = etbExported ? 'green' : 'orange';

  return (
    <>
      <Button
        danger
        icon={<PiStopCircle />}
        type="dashed"
        iconPosition="end"
        onClick={() => {
          setModalOpen(true);
        }}
      >
        Einsatz abschließen
      </Button>

      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        classNames={{
          wrapper: 'bg-primary-600/75',
        }}
        maskClosable={false}
        closable={false}
        cancelButtonProps={{ icon: <PiX />, iconPosition: 'end' }}
        okText="Abschließen"
        okButtonProps={{ icon: <PiConfetti />, iconPosition: 'end' }}
        title="Einsatz abschließen"
      >
        <div>
          <ConfigProvider
            theme={{
              components: {
                Button: { colorText: color, colorPrimaryHover: color },
              },
            }}
          >
            <Button
              icon={etbExported ? <PiCheck /> : <PiDownload />}
              iconPosition="end"
              loading={exporting}
              onClick={async () => {
                setExporting(true);
                try {
                  const fileContent = await backendFetchBlob('/export/pdf');
                  const fileName = `${props.einsatz.einsatzAlarmstichwort?.code}-${format(props.einsatz.beginn, natoDateTime)}.pdf`;
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
            >
              {etbExported ? 'ETB exportiert' : 'ETB exportieren'}
            </Button>
          </ConfigProvider>
        </div>
      </Modal>
    </>
  );
}

interface EinsatzdatenFormProps {}

interface EinsatzdatenFormProps {
  mapboxApiKey?: SecretsDto;
}

export function EinsatzdatenForm(): JSX.Element {
  const { einsatz, updateEinsatz } = useEinsatz();
  const { alarmstichworte } = useAlarmstichworte();
  const [form] = Form.useForm<UpdateMissionFormData>();

  const alarmstichworteItems = useMemo<DefaultOptionType[]>(() => {
    return (
      alarmstichworte.data?.data.map(
        (item) =>
          ({
            item,
            label: (
              <div className="flex justify-between gap-4">
                <span>{item.code}</span>
                <Tooltip title={item.description}>
                  <span className="truncate">{item.description}</span>
                </Tooltip>
              </div>
            ),
            value: item.id,
          }) satisfies DefaultOptionType,
      ) ?? []
    );
  }, [alarmstichworte.data]);

  const defaultStichwort = useMemo<string | undefined>(() => {
    return alarmstichworte.data?.data.find((a) => a.code === einsatz.data?.einsatzAlarmstichwort.code)?.id;
  }, [alarmstichworte.data, einsatz.data]);

  // TODO[feat/improve-einsatztagebuch](rubeen, 10.10.24): Places should be saved on submit
  // TODO[feat/improve-einsatztagebuch](rubeen, 10.10.24): create a new component for this place-searching feat
  const optionsReducer = (state: DefaultOptionType[], action: { type: string; payload: any }): DefaultOptionType[] => {
    console.log('optionsReducer', action);
    switch (action.type) {
      case 'SET_SUGGESTIONS':
        return action.payload.map((suggestion: any) => ({
          id: suggestion.mapbox_id,
          label: suggestion.name + `, ${suggestion.place_formatted}`,
          value: suggestion.name + `, ${suggestion.place_formatted}`,
        }));
      default:
        return state;
    }
  };

  const [options, dispatch] = useReducer(optionsReducer, []);

  if (!einsatz.data || !defaultStichwort) {
    return <>Einsatz laden...</>;
  }

  return (
    <section>
      <h1 className="">Einsatzdaten</h1>
      <FormLayout<UpdateMissionFormData>
        type="sectioned"
        formInstance={form}
        form={{
          className: 'space-y-4',
          validateTrigger: 'onBlur',
          initialValues: {
            alarmstichwort: defaultStichwort,
            einsatzleiter: { name: 'Peter Müller', ort: einsatz.data.einsatzMeta?.ort },
            timeframe: [einsatz.data.beginn, einsatz.data.ende].filter((time) => time).map((t) => dayjs(t)),
          },
          async onFinish(data) {
            console.log('submitting einsatzdaten', { data });
            await updateEinsatz.mutateAsync({
              id: einsatz.data!!.id,
              data: {
                ...data,
                timeframe: [data.timeframe[0]?.toISOString(), data.timeframe[1]?.toISOString()],
              },
            });
          },
          validateMessages: {
            required: '${label} ist ein Pflichtfeld',
          },
        }}
      >
        {() => (
          <>
            <FormSection heading="Alarmierung">
              <FormContentBox>
                <InputWrapper name="alarmstichwort" label="Alarmstichwort" rules={[{ required: true }]}>
                  <Select loading={alarmstichworte.isLoading} options={alarmstichworteItems} />
                </InputWrapper>
                <InputWrapper name="timeframe" label="Alarmierungszeit" rules={[{ required: true }]}>
                  <DatePicker.RangePicker
                    showTime
                    format={natoDateTimeAnt}
                    showSecond={false}
                    placeholder={['', 'Laufend']}
                    allowEmpty={[false, true]}
                    onChange={(date: RangeValue<Dayjs>) => {
                      console.log(date?.[0], date?.[1]);
                    }}
                  />
                </InputWrapper>
                <InputWrapper name="ort" label="Ort" rules={[{ required: true }]}>
                  <AddressAutocomplete
                    defaultValue={einsatz.data?.einsatzMeta?.ort}
                    onChange={(value) => form.setFieldsValue({ ort: value })}
                  />
                </InputWrapper>
              </FormContentBox>
            </FormSection>
            <FormSection heading="Laufender Einsatz">
              <FormContentBox>
                <InputWrapper name="einsatzleiter" label="Einsatzleiter" rules={[{ required: true }]}>
                  <Select disabled />
                </InputWrapper>
              </FormContentBox>
            </FormSection>
            <Button onClick={() => form.submit()} type="primary" htmlType="submit" loading={updateEinsatz.isPending}>
              Speichern
            </Button>
          </>
        )}
      </FormLayout>
      <FinishEinsatz einsatz={einsatz.data} />
    </section>
  );
}
