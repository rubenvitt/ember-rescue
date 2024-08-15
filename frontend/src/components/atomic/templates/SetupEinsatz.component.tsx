import React, { useMemo } from 'react';
import { SetupEinsatzHeader } from '../molecules/setup-einsatz/Header.component.js';
import { SetupEinsatzOffeneEinsaetze } from '../molecules/setup-einsatz/OffeneEinsaetze.component.js';
import { SetupEinsatzForm } from '../molecules/setup-einsatz/Form.component.js';
import { useEinsatz } from '../../../hooks/einsatz.hook.js';
import { DatePicker, Form, Select } from 'formik-antd';
import { Formik } from 'formik';
import { natoDateTimeAnt } from '../../../utils/time.ts';
import dayjs from 'dayjs';
import { InputWithLabel } from '../atoms/InputWithLabel.component.js';
import { useEinheiten } from '../../../hooks/einheiten/einheiten.hook.js';
import { DefaultOptionType } from 'antd/lib/select/index.js';
import { useAlarmstichworte } from '../../../hooks/alarmstichworte.hook.js';
import { Button } from 'antd';

function NewSetupEinsatzForm() {
  const { einheiten } = useEinheiten();
  const { alarmstichworte } = useAlarmstichworte();

  const einheitenItems = useMemo<DefaultOptionType[] | undefined>(() => {
    return einheiten.data?.map(einheit => ({
      value: einheit.id,
      searchString: einheit.funkrufname.toLowerCase() + einheit.einheitTyp.label.toLowerCase(),
      label: <div className="flex justify-between gap-4">
        <span className="flex-shrink-0 truncate">{einheit.funkrufname}</span>
        <span className="ml-2 flex-shrink truncate text-gray-500 dark:text-gray-300">{einheit.einheitTyp.label}</span>
      </div>,
      item: einheit,
    } as DefaultOptionType));
  }, [einheiten.data]);

  const alarmstichworteItems = useMemo<DefaultOptionType[] | undefined>(() => {
    return alarmstichworte.data?.map(stichwort => ({
      value: stichwort.id,
      searchString: (stichwort.bezeichnung + stichwort.beschreibung).toLowerCase(),
      label: <div className="flex justify-between gap-4">
        <span className="flex-shrink-0 truncate">{stichwort.bezeichnung}</span>
        <span className="ml-2 flex-shrink truncate text-gray-500 dark:text-gray-300">{stichwort.beschreibung}</span>
      </div>,
    } as DefaultOptionType));
  }, [alarmstichworte.data]);

  return <Formik initialValues={{ timestamp: dayjs() }} onSubmit={(data) => console.log(data)}>
    <Form className="space-y-4">
      <InputWithLabel label="Aufnehmendes Rettungsmittel" name="aufnehmendesRettungsmittel">
        <Select name="aufnehmendesRettungsmittel" placeholder="Aufnehmendes Rettungsmittel" className="w-full"
                showSearch
          // @ts-ignore
                spellCheck={false}
                filterOption={(inputValue, option) => option?.searchString.includes(inputValue.toLowerCase())}
                options={einheitenItems} loading={einheiten.isLoading} />
      </InputWithLabel>
      <InputWithLabel label="Zeitpunkt der Erstalarmierung" name="timestamp">
        <DatePicker className="w-full" showTime showSecond={false} format={{ format: natoDateTimeAnt }}
                    name="timestamp" />
      </InputWithLabel>
      <InputWithLabel label="Einsatzstichwort der Alarmierung" name="einsatzstichwort">
        <Select name="einsatzstichwort" placeholder="Einsatzstichwort der Alarmierung" className="w-full"
                showSearch
          // @ts-ignore
                spellCheck={false}
                filterOption={(inputValue, option) => {
                  // Create a regular expression that matches the characters of inputValue in sequence, ignoring spaces.
                  const regex = new RegExp(inputValue.split('').join('.*'), 'i');
                  return regex.test(option?.searchString);
                }}
                options={alarmstichworteItems} loading={alarmstichworte.isLoading} />
      </InputWithLabel>
      <Button htmlType="submit" />
    </Form>
  </Formik>;
}

export const SetupEinsatzTemplate: React.FC = () => {
  const { offeneEinsaetze } = useEinsatz();
  const einsatzOffen = useMemo(() => offeneEinsaetze.data && offeneEinsaetze.data.length > 0, [offeneEinsaetze.data]);

  return (
    <div className="flex gap-4 flex-col items-center min-h-screen">
      <div className="w-full max-w-6xl flex flex-col gap-16 space-y-6">
        <SetupEinsatzHeader einsatzOffen={einsatzOffen ?? false} />
        {einsatzOffen && <SetupEinsatzOffeneEinsaetze />}
        <NewSetupEinsatzForm />
        <SetupEinsatzForm />
      </div>
    </div>
  );
};
