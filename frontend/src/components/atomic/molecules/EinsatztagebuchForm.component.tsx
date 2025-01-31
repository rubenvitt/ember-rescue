import { Button, DatePicker, Form, Input, Select } from 'antd';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { PiCaretDown } from 'react-icons/pi';
import { useEinsatz } from '../../../hooks/einsatz.hook.js';
import { useEinsatztagebuch } from '../../../hooks/einsatztagebuch.hook.js';
import { useFahrzeugeItems } from '../../../hooks/fahrzeuge/fahrzeuge-items.hook.js';
import { CreateEinsatztagebuchEintrag } from '../../../types/app/einsatztagebuch.types.js';
import { InputWrapper } from '../atoms/InputWrapper.component.js';
import { FormLayout } from '../organisms/form/FormLayout.comonent.js';


interface Props {
  closeForm: () => void;
}

// TODO[main](rubeen, 01.09.24): Lagemeldungen sollten möglich sein - eventuell mit einer Checkbox `isLagemeldung`?
//  oder type: 'lagemeldung' ein bisschen erweiterbarer.
export function EinsatztagebuchForm({ closeForm }: Props) {
  const { createEinsatztagebuchEintrag } = useEinsatztagebuch();
  const { einsatz } = useEinsatz();
  const [hasUserChangedTimestamp, setHasUserChangedTimestamp] = useState(false);
  const [form] = Form.useForm();

  const updateTimestamp = useCallback(() => {
    form.setFieldValue('timestamp', dayjs());
  }, [form]);

  useEffect(() => {
    if (hasUserChangedTimestamp) return;
    const interval = setInterval(updateTimestamp, 1000);
    return () => clearInterval(interval);
  }, [hasUserChangedTimestamp, form, updateTimestamp]);

  const { fahrzeugeAsItems: fahrzeugeImEinsatzAsItems, loading: fahrzeugeImEinsatzLoading } = useFahrzeugeItems({
    include: ['fahrzeugeImEinsatz'],
  });
  const { fahrzeugeAsItems: fahrzeugeNichtImEinsatzAsItems, loading: fahrzeugeNichtImEinsatzLoading } = useFahrzeugeItems({
    include: ['fahrzeugeNichtImEinsatz'],
  });

  const handleSubmit = useCallback(
    async (data: CreateEinsatztagebuchEintrag) => {
      closeForm();
      await createEinsatztagebuchEintrag.mutateAsync({
        content: data.content,
        empfaenger: data.empfaenger,
        absender: data.absender,
        timestamp: data.timestamp,
        type: 'USER',
      });
    },
    [closeForm, createEinsatztagebuchEintrag],
  );

  const aufnehmendesRettungsmittelId = useMemo(() => {
    return einsatz?.data?.aufnehmendesRettungsmittel ?? '';
  }, [einsatz?.data?.aufnehmendesRettungsmittel]);

  return (
    <FormLayout<CreateEinsatztagebuchEintrag>
      resetOnSubmit={true}
      formInstance={form}
      form={{
        rootClassName: 'grid grid-cols-2 gap-4',
        initialValues: { timestamp: dayjs(), empfaenger: aufnehmendesRettungsmittelId },
        async onFinish(data) {
          await handleSubmit(data);
        },
      }}
    >
      {() => (
        <>
          <InputWrapper name="absender" label="Absender" rules={[{ required: true, message: 'Es sollte ein Absender angegeben werden' }]}>
            <Select
              showSearch
              options={[
                {
                  label: 'Fahrzeuge im Einsatz',
                  options: fahrzeugeImEinsatzAsItems ?? [],
                },
                {
                  label: 'Verfügbare Fahrzeuge',
                  options: fahrzeugeNichtImEinsatzAsItems ?? [],
                },
              ]}
              loading={fahrzeugeImEinsatzLoading || fahrzeugeNichtImEinsatzLoading}
              placeholder="Absender auswählen"
            />
          </InputWrapper>
          <InputWrapper name="empfaenger" label="Empfänger" rules={[{ required: true, message: 'Es sollte ein Empfänger angegeben werden' }]}>
            <Select
              showSearch
              options={[
                {
                  label: 'Fahrzeuge im Einsatz',
                  options: fahrzeugeImEinsatzAsItems ?? [],
                },
                {
                  label: 'Verfügbare Fahrzeuge',
                  options: fahrzeugeNichtImEinsatzAsItems ?? [],
                },
              ]}
              loading={fahrzeugeImEinsatzLoading || fahrzeugeNichtImEinsatzLoading}
              placeholder="Empfänger auswählen"
            />
          </InputWrapper>
          <InputWrapper name="content" className="col-span-2" label="Inhalt" rules={[{ required: true, message: 'Ein Eintrag benötigt eine Nachricht' }]}>
            <Input.TextArea name="content" rows={3} />
          </InputWrapper>
          <InputWrapper name="timestamp" label="Zeitpunkt der Meldung" rules={[{ required: true, message: 'Es wird ein Zeitpunkt der Meldung benötigt' }]}>
            <DatePicker className="w-full" showTime showSecond={false} name={'timestamp'} onChange={() => setHasUserChangedTimestamp(true)} />
          </InputWrapper>
          <Button className="col-span-2" type="primary" htmlType="submit" icon={<PiCaretDown size={24} />}>
            ETB Eintrag anlegen
          </Button>
        </>
      )}
    </FormLayout>
  );
}
