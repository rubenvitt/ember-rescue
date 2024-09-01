import { useEinsatztagebuch } from '../../../hooks/einsatztagebuch.hook.js';
import { useCallback, useMemo } from 'react';
import { formatISO } from 'date-fns';
import { useEinsatz } from '../../../hooks/einsatz.hook.js';
import { CreateEinsatztagebuchEintrag } from '../../../types/app/einsatztagebuch.types.js';
import { useEinheitenItems } from '../../../hooks/einheiten/einheiten-items.hook.js';
import { FormLayout } from '../organisms/form/FormLayout.comonent.js';
import { InputWrapper } from '../atoms/InputWrapper.component.js';
import { DatePicker, Input, Select } from 'formik-antd';
import * as Yup from 'yup';
import { Button } from 'antd';
import { PiCaretDown } from 'react-icons/pi';

interface Props {
  closeForm: () => void;
}

const CreateEtbShema = Yup.object().shape({
  timestamp: Yup.string().required('Es wird ein Zeitpunkt der Meldung benötigt'),
  absender: Yup.string().required('Es sollte ein Absender angegeben werden'),
  empfaenger: Yup.string().required('Es sollte ein Empfänger angegeben werden'),
  content: Yup.string().required('Ein Eintrag benötigt eine Nachricht'),
});

// TODO[main](rubeen, 01.09.24): Lagemeldungen sollten möglich sein - eventuell mit einer Checkbox `isLagemeldung`?
//  oder type: 'lagemeldung' ein bisschen erweiterbarer.
export function EinsatztagebuchForm({ closeForm }: Props) {
  const { createEinsatztagebuchEintrag } = useEinsatztagebuch();
  const { einsatz } = useEinsatz();

  const { einheitenAsItems, loading } = useEinheitenItems({
    include: ['einheitenImEinsatz', 'einheitenNichtImEinsatz'],
  });

  const handleSubmit = useCallback(async (data: CreateEinsatztagebuchEintrag) => {
    closeForm();
    await createEinsatztagebuchEintrag.mutateAsync({
      content: data.content,
      empfaenger: einheitenAsItems.find((item) => data.empfaenger === item.item.id)?.item?.funkrufname ?? data.empfaenger,
      absender: einheitenAsItems.find((item) => data.absender === item.item.id)?.item?.funkrufname ?? data.absender,
      timestamp: data.timestamp,
    });
  }, [closeForm, createEinsatztagebuchEintrag]);

  const aufnehmendesRettungsmittelId = useMemo(() => {
    return einsatz?.data?.aufnehmendesRettungsmittelId ?? '';
  }, [einsatz?.data?.aufnehmendesRettungsmittelId]);

  return (
    <FormLayout<CreateEinsatztagebuchEintrag> form={{ rootClassName: 'grid grid-cols-2 gap-4' }} formik={{
      initialValues: {
        timestamp: formatISO(new Date()),
        absender: '',
        empfaenger: aufnehmendesRettungsmittelId,
        content: '',
      },
      onSubmit: async (data, formikHelpers) => {
        await handleSubmit(data);
        formikHelpers.resetForm();
      },
      validationSchema: CreateEtbShema,
    }}>
      {(props) => (
        <>
          <InputWrapper name="absender" label="Absender">
            <Select name="absender"
                    showSearch options={einheitenAsItems}
                    loading={loading}
                    placeholder="Absender auswählen"
            />
          </InputWrapper>
          <InputWrapper name="empfaenger" label="Empfänger">
            <Select name="empfaenger"
                    showSearch options={einheitenAsItems}
                    loading={loading}
                    placeholder="Empfönger auswählen"
            />
          </InputWrapper>
          <InputWrapper name="content" className="col-span-2" label="Inhalt">
            <Input.TextArea name="content" rows={3} />
          </InputWrapper>
          <InputWrapper name="timestamp" label="Zeitpunkt der Meldung">
            <DatePicker
              className="w-full"
              showTime showSecond={false}
              name={'timestamp'} />
          </InputWrapper>
          <Button className="col-span-2" type="primary" onClick={props.submitForm} htmlType="submit"
                  icon={<PiCaretDown size={24} />}>ETB
            Eintrag anlegen</Button>
        </>
      )}
    </FormLayout>
  );
}