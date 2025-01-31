import { CreateMissionDto } from '@bluelight-hub/shared/client/index.js';
import { useSearchBoxCore } from '@mapbox/search-js-react';
import { useNavigate } from '@tanstack/react-router';
import { AutoComplete, AutoCompleteProps, DatePicker, Select } from 'antd';
import { DefaultOptionType } from 'antd/lib/select/index.js';
import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';
import { PiArrowCircleUpRight } from 'react-icons/pi';
import { useAlarmstichworte } from '../../../../hooks/alarmstichworte.hook.js';
import { useEinsatz } from '../../../../hooks/einsatz.hook.js';
import { useFahrzeuge } from '../../../../hooks/fahrzeuge/fahrzeuge.hook.js';
import { useOpta } from '../../../../hooks/opta.hook.js';
import { useSecret } from '../../../../hooks/secrets.hook.js';
import { InputWrapper } from '../../atoms/InputWrapper.component.js';
import { FormContentBox } from '../../organisms/form/FormContentBox.component.js';
import { FormLayout } from '../../organisms/form/FormLayout.comonent.js';
import { FormSection } from '../../organisms/form/FormSection.component.js';

const AddressAutocomplete = () => {
  const { secret } = useSecret({ secretKey: 'mapboxApi' });
  const searchBox = useSearchBoxCore({
    accessToken: secret.data?.value ?? '',
    country: 'de',
    proximity: '10.55,52.96',
    language: 'de',
    // @ts-ignore api is newer
    types: new Set(['country', 'region', 'postcode', 'district', 'place', 'locality', 'neighborhood', 'street', 'address']),
  });

  const [options, setOptions] = useState<AutoCompleteProps['options']>([]);

  const handleSearch = async (value: string) => {
    if (!value || !secret.data?.value) {
      setOptions([]);
      return;
    }

    try {
      const results = await searchBox.suggest(value, { sessionToken: 'test-asd' });
      console.log('results', results);
      const formattedOptions = results.suggestions.map(result => ({
        id: result.mapbox_id,
        value: result.name + ', ' + result.place_formatted,
        label: result.name + ", " + result.place_formatted,
      } satisfies DefaultOptionType));
      setOptions(formattedOptions);
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      setOptions([]);
    }
  };

  return (
    <InputWrapper label="Einsatzadresse" name="ort" rules={[{ required: true, message: 'Die Einsatzadresse wird benötigt' }]}>
      <AutoComplete
        options={options}
        onSearch={handleSearch}
        placeholder="Adresse eingeben..."
        allowClear
        // @ts-ignore
        spellCheck={false}
        style={{ width: '100%' }}
      />
    </InputWrapper>
  );
};

export function NewSetupEinsatzForm() {
  // FIXME[ember-rescue-68](rubeen, 30.11.24): Use fahrzeugeTemplate
  const { templateFahrzeuge } = useFahrzeuge();
  const { functionOpta } = useOpta();
  const { alarmstichworte } = useAlarmstichworte();
  const { createEinsatz, saveEinsatz } = useEinsatz(false);
  const navigate = useNavigate();

  const fahrzeugeItems = useMemo<DefaultOptionType[] | undefined>(() => {
    return templateFahrzeuge.data?.data.map((fahrzeug) => {
      let fahrzeugFunctionOpta = functionOpta.data?.data.find((opta) => opta.code === fahrzeug.opta.functionCode);
      return {
        value: fahrzeug.fullOpta,
        searchString: fahrzeug.fullOpta?.toLowerCase() ?? '' + fahrzeugFunctionOpta?.label.toLowerCase(),
        label: (
          <div className="flex justify-between gap-4">
            <span className="shrink-0 truncate">{fahrzeug.fullOpta}</span>
            <span className="ml-2 shrink truncate text-gray-500 dark:text-gray-300">{fahrzeugFunctionOpta?.label}</span>
          </div>
        ),
        item: fahrzeug,
      } as DefaultOptionType;
    });
  }, [templateFahrzeuge.data, functionOpta.data]);

  const alarmstichworteItems = useMemo<DefaultOptionType[] | undefined>(() => {
    return alarmstichworte.data?.data.map(
      (stichwort) =>
        ({
          value: stichwort.code,
          searchString: (stichwort.code + stichwort.description).toLowerCase(),
          label: (
            <div className="flex justify-between gap-4">
              <span className="shrink-0 truncate">{stichwort.code}</span>
              <span className="ml-2 shrink truncate text-gray-500 dark:text-gray-300">{stichwort.description}</span>
            </div>
          ),
        }) as DefaultOptionType,
    );
  }, [alarmstichworte.data]);

  const handleAbbrechen = useCallback(() => navigate({ to: '/auth/signout' }), [navigate]);

  return (
    <FormLayout<CreateMissionDto>
      type="sectioned"
      form={{
        initialValues: {
          erstAlarmiert: dayjs(),
        },
        async onFinish(data) {
          console.log('createMissionDto', { data });
          await createEinsatz.mutateAsync({ ...data }).then((einsatz) => {
            saveEinsatz(einsatz);
            setTimeout(() => {
              navigate({ to: '/app/' });
            }, 1000);
          });
        },
      }}
      buttons={{
        cancel: { type: 'dashed', onClick: handleAbbrechen, children: 'Abbrechen' },
        submit: {
          type: 'primary',
          htmlType: 'submit',
          loading: createEinsatz.isPending,
          icon: <PiArrowCircleUpRight />,
          iconPosition: 'end',
          children: 'Einsatz anlegen',
        },
      }}
    >
      <FormSection heading="Einsatzdaten" subHeading="Grundlegende Daten zum Einsatz">
        <FormContentBox>
          <InputWrapper label="Aufnehmendes Rettungsmittel" name="aufnehmendesRettungsmittel" rules={[{ required: true, message: 'Das aufnehmende Rettungsmittel wird benötigt' }]}>
            <Select
              placeholder="Aufnehmendes Rettungsmittel"
              className="w-full"
              showSearch
              // @ts-ignore
              spellCheck={false}
              filterOption={(inputValue, option) => option?.searchString.includes(inputValue.toLowerCase())}
              options={fahrzeugeItems}
              loading={templateFahrzeuge.isLoading}
            />
          </InputWrapper>
          <AddressAutocomplete />
        </FormContentBox>
      </FormSection>

      <FormSection heading="Alarmierung" subHeading="Informationen zur Alarmierung">
        <FormContentBox>
          <InputWrapper label="Zeitpunkt der Erstalarmierung" name="erstAlarmiert" rules={[{ required: true, message: 'Zeitpunkt der Erstalarmierung wird benötigt' }]}>
            <DatePicker className="w-full" showTime showSecond={false} name="erstAlarmiert" />
          </InputWrapper>
          <InputWrapper label="Einsatzstichwort der Alarmierung" name="alarmstichwort" rules={[{ required: true, message: 'Geben Sie ein Einsatzstichwort an' }]}>
            <Select
              placeholder="Einsatzstichwort der Alarmierung"
              className="w-full"
              showSearch
              // @ts-ignore
              spellCheck={false}
              filterOption={(inputValue, option) => {
                // Create a regular expression that matches the characters of inputValue in sequence, ignoring spaces.
                const regex = new RegExp(inputValue.split('').join('.*'), 'i');
                return regex.test(option?.searchString);
              }}
              options={alarmstichworteItems}
              loading={alarmstichworte.isLoading}
            />
          </InputWrapper>
        </FormContentBox>
      </FormSection>
    </FormLayout>
  );
}
