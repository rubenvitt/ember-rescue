import { useEinsatz } from '../../../hooks/einsatz.hook.js';
import { useMemo, useReducer, useState } from 'react';
import { useAlarmstichworte } from '../../../hooks/alarmstichworte.hook.js';
import { Einsatz } from '../../../types/app/einsatz.types.js';
import { PiCheck, PiConfetti, PiDownload, PiStopCircle, PiX } from 'react-icons/pi';
import { BaseDirectory, writeFile } from '@tauri-apps/plugin-fs';
import { natoDateTime, natoDateTimeAnt } from '../../../utils/time.js';
import { format } from 'date-fns';
import { backendFetchBlob } from '../../../utils/http.js';
import { isTauri } from '@tauri-apps/api/core';
import { Button, ConfigProvider, Modal, Tooltip } from 'antd';
import { FormLayout } from './form/FormLayout.comonent.js';
import { FormSection } from './form/FormSection.component.js';
import { FormContentBox } from './form/FormContentBox.component.js';
import { InputWrapper } from '../atoms/InputWrapper.component.js';
import { AutoComplete, DatePicker, Select } from 'formik-antd';
import { DefaultOptionType } from 'antd/lib/select/index.js';
import * as Yup from 'yup';
import { Dayjs } from 'dayjs';
import { RangeValue } from '../../../types/ui/inputs.types.js';
import { Secret } from '../../../hooks/secrets.hook.js';
import { useSearchBoxCore } from '@mapbox/search-js-react';

interface Einsatzdaten {
  alarmstichwort: string;
  einsatzleiter: { id?: string; name: string };
  ort: string;
  timeframe: [string, string | null];
}

const EinsatzdatenValidationSchema = Yup.object().shape({
  alarmstichwort: Yup.string().required('Alarmstichwort ist ein Pflichtfeld'),
  einsatzleiter: Yup.object().shape({
    id: Yup.string().nullable(),
    name: Yup.string().required('Einsatzleiter ist ein Pflichtfeld'),
  }),
  ort: Yup.string().required('Ort ist ein Pflichtfeld'),
  timeframe: Yup.array()
    .required('Alarmierungszeit ist ein Pflichtfeld')
    .test('timeframe', 'Alarmierungszeit muss zwischen 10 Minuten und 24 Stunden liegen', (value) => {
      console.log('timeframe', value);
      const [start, end] = value;
      if (!start || !end) {
        return false;
      }
      const startDiff = start.diff(end, 'minute');
      return startDiff >= 10 && startDiff <= 1440;
    }),
});

function FinishEinsatz(props: { einsatz: Einsatz }) {
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
  mapboxApiKey?: Secret;
}

export function EinsatzdatenForm({ mapboxApiKey }: EinsatzdatenFormProps): JSX.Element {
  const { einsatz, updateEinsatz } = useEinsatz();
  const { alarmstichworte } = useAlarmstichworte();

  const alarmstichworteItems = useMemo<DefaultOptionType[]>(() => {
    return (
      alarmstichworte.data?.map(
        (item) =>
          ({
            item,
            label: (
              <div className="flex justify-between gap-4">
                <span>{item.bezeichnung}</span>
                <Tooltip title={item.beschreibung}>
                  <span className="truncate">{item.beschreibung}</span>
                </Tooltip>
              </div>
            ),
            value: item.id,
          }) satisfies DefaultOptionType,
      ) ?? []
    );
  }, [alarmstichworte.data]);

  const defaultStichwort = useMemo<string | undefined>(() => {
    return alarmstichworte.data?.find((a) => a.bezeichnung === einsatz.data?.einsatz_alarmstichwort?.bezeichnung)?.id;
  }, [alarmstichworte.data, einsatz.data]);

  const searchBoxCore = useSearchBoxCore({
    accessToken: mapboxApiKey?.value,
    language: 'de',
    country: 'de',
    // @ts-ignore api is newer
    types: new Set([
      'country',
      'region',
      'postcode',
      'district',
      'place',
      'city',
      'locality',
      'neighborhood',
      'street',
      'address',
      'poi',
    ]),
  });

  // TODO[feat/improve-einsatztagebuch](rubeen, 10.10.24): Places should be saved on submit
  // TODO[feat/improve-einsatztagebuch](rubeen, 10.10.24): create a new component for this place-searching feat
  const optionsReducer = (state: DefaultOptionType[], action: { type: string; payload: any }): DefaultOptionType[] => {
    console.log('optionsReducer', action);
    switch (action.type) {
      case 'SET_SUGGESTIONS':
        return action.payload.map((suggestion: any) => ({
          label: suggestion.name + `, ${suggestion.place_formatted}`,
          value: suggestion.name + `, ${suggestion.place_formatted}`,
        }));
      default:
        return state;
    }
  };

  const [options, dispatch] = useReducer(optionsReducer, []);

  const sessionToken = useMemo(() => {
    return Math.random().toString(36).slice(2, 9);
  }, []);

  const handleSearch = useMemo(
    () => async (query: string) => {
      console.log('search', query);
      const response = await searchBoxCore.suggest(query, {
        sessionToken,
        proximity: '10.55,52.96',
      });
      const suggestions = response.suggestions;
      dispatch({ type: 'SET_SUGGESTIONS', payload: suggestions });
    },
    [sessionToken, dispatch, searchBoxCore],
  );

  if (!einsatz.data || !defaultStichwort) {
    return <>Einsatz laden...</>;
  }

  return (
    <section>
      <h1 className="">Einsatzdaten</h1>
      <FormLayout<Einsatzdaten>
        type="sectioned"
        formik={{
          validationSchema: EinsatzdatenValidationSchema,
          validateOnBlur: true,
          initialValues: {
            alarmstichwort: defaultStichwort,
            // einsatzleiter: { id: einsatz.data.einsatzleiter.id, name: einsatz.data.einsatzleiter.name },
            // ort: einsatz.data.ort,
            einsatzleiter: { name: 'Peter Müller' },
            ort: einsatz.data.einsatz_meta.ort,
            timeframe: [einsatz.data.beginn, einsatz.data.ende],
          },
          onSubmit: (data) => {
            console.log('submitting einsatzdaten', { data });
            updateEinsatz.mutate({ id: einsatz.data!!.id, data });
          },
        }}
        form={{ className: 'space-y-4' }}
      >
        {(props) => (
          <>
            <FormSection heading="Alarmierung">
              <FormContentBox>
                <InputWrapper name="alarmstichwort" label="Alarmstichwort">
                  <Select name="alarmstichwort" loading={alarmstichworte.isLoading} options={alarmstichworteItems} />
                </InputWrapper>
                <InputWrapper name="beginn" label="Alarmierungszeit">
                  <DatePicker.RangePicker
                    name="timeframe"
                    showTime
                    format={{ format: natoDateTimeAnt }}
                    showSecond={false}
                    placeholder={['', 'Laufend']}
                    allowEmpty={[false, true]}
                    onChange={(date: RangeValue<Dayjs>) => {
                      console.log(date?.[0], date?.[1]);
                    }}
                  />
                </InputWrapper>
                <InputWrapper name="ort" label="Ort">
                  {/* todo connect mapbox api */}
                  <AutoComplete onSearch={handleSearch} options={options} name="ort" />
                </InputWrapper>
              </FormContentBox>
            </FormSection>
            <FormSection heading="Laufender Einsatz">
              {JSON.stringify(einsatz.data)}
              <FormContentBox>
                <InputWrapper name="einsatzleiter" label="Einsatzleiter">
                  <Select name="einsatzleiter" disabled />
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
    </section>
  );
}
