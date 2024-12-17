import { useEinsatztagebuch } from '../../../hooks/einsatztagebuch.hook.js';
import { useCallback, useMemo } from 'react';
import { formatISO } from 'date-fns';
import { useEinsatz } from '../../../hooks/einsatz.hook.js';
import { CreateEinsatztagebuchEintrag } from '../../../types/app/einsatztagebuch.types.js';
import { useFahrzeugeItems } from '../../../hooks/fahrzeuge/fahrzeuge-items.hook.js';
import { FormLayout } from '../organisms/form/FormLayout.comonent.js';
import { InputWrapper } from '../atoms/InputWrapper.component.js';
import { Button, DatePicker, Input, Select } from 'antd';
import { PiCaretDown } from 'react-icons/pi';

interface Props {
  closeForm: () => void;
}

// TODO[main](rubeen, 01.09.24): Lagemeldungen sollten möglich sein - eventuell mit einer Checkbox `isLagemeldung`?
//  oder type: 'lagemeldung' ein bisschen erweiterbarer.
export function EinsatztagebuchForm({ closeForm }: Props) {
  const { createEinsatztagebuchEintrag } = useEinsatztagebuch();
  const { einsatz } = useEinsatz();

  const { fahrzeugeAsItems, loading } = useFahrzeugeItems({
    include: ['fahrzeugeImEinsatz', 'fahrzeugeNichtImEinsatz'],
  });

  const handleSubmit = useCallback(
    async (data: CreateEinsatztagebuchEintrag) => {
      closeForm();
      await createEinsatztagebuchEintrag.mutateAsync({
        content: data.content,
        empfaenger: fahrzeugeAsItems.find((item) => data.empfaenger === item.item.id)?.item?.funkrufname ?? data.empfaenger,
        absender: fahrzeugeAsItems.find((item) => data.absender === item.item.id)?.item?.funkrufname ?? data.absender,
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
      form={{
        rootClassName: 'grid grid-cols-2 gap-4',
        initialValues: { timestamp: formatISO(new Date()), empfaenger: aufnehmendesRettungsmittelId },
        async onFinish(data) {
          await handleSubmit(data);
        },
      }}
    >
      {(props) => (
        <>
          <InputWrapper name="absender" label="Absender" rules={[{ required: true, message: 'Es sollte ein Absender angegeben werden' }]}>
            <Select showSearch options={fahrzeugeAsItems} loading={loading} placeholder="Absender auswählen" />
          </InputWrapper>
          <InputWrapper name="empfaenger" label="Empfänger" rules={[{ required: true, message: 'Es sollte ein Empfänger angegeben werden' }]}>
            <Select showSearch options={fahrzeugeAsItems} loading={loading} placeholder="Empfönger auswählen" />
          </InputWrapper>
          <InputWrapper name="content" className="col-span-2" label="Inhalt" rules={[{ required: true, message: 'Ein Eintrag benötigt eine Nachricht' }]}>
            <Input.TextArea name="content" rows={3} />
          </InputWrapper>
          <InputWrapper name="timestamp" label="Zeitpunkt der Meldung" rules={[{ required: true, message: 'Es wird ein Zeitpunkt der Meldung benötigt' }]}>
            <DatePicker className="w-full" showTime showSecond={false} name={'timestamp'} />
          </InputWrapper>
          <Button className="col-span-2" type="primary" onClick={props?.submit} htmlType="submit" icon={<PiCaretDown size={24} />}>
            ETB Eintrag anlegen
          </Button>
        </>
      )}
    </FormLayout>
  );
}
