import { useMemo, useRef, useState } from 'react';
import { createLazyFileRoute } from '@tanstack/react-router';
import { EinheitenlisteComponent } from '../../components/atomic/organisms/Einheitenliste.component.js';
import { useQualifikationen } from '../../hooks/qualifikationen.hook.js';
import { useEinheiten } from '../../hooks/einheiten/einheiten.hook.js';
import { EmptyEinheitenState } from '../../components/atomic/molecules/EmptyEinheitenState.component.js';
import { ItemType } from '../../components/atomic/molecules/Combobox.component.js';
import { EinheitDto } from '../../types/types.js';
import { GenericForm } from '../../components/atomic/organisms/GenericForm.component.js';
import { PiAmbulance, PiBell } from 'react-icons/pi';
import { useModal } from '../../hooks/modal.hook.js';
import { ModalConfig } from '../../types/modalTypes.js';
import { GenericFormRef } from '../../types/form.types.js';
import { Button } from '../../components/atomic/molecules/Button.component.tsx';

export const Route = createLazyFileRoute('/app/einheiten')({
  component: Einheiten,
});

type AddEinheitType = {
  einheitId: string
}

function Einheiten() {
  const [fahrzeug, setFahrzeug] = useState('');
  const { qualifikationen } = useQualifikationen();
  const {
    einheiten,
    einheitenImEinsatz,
    addEinheitToEinsatz,
    einheitenNichtImEinsatz,
  } = useEinheiten();

  const einheitenNichtImEinsatzCombo = useMemo<ItemType<EinheitDto>[]>(() => {
    return einheitenNichtImEinsatz.map(item => ({
      label: item.funkrufname,
      secondary: item.einheitTyp.label,
      item,
    }));
  }, [einheitenNichtImEinsatz]);

  // const einheitenCombo = useMemo<ItemType<EinheitDto>[]>(() => {
  //   return einheiten.data?.map(item => ({
  //     label: item.funkrufname,
  //     secondary: item.einheitTyp.label,
  //     item,
  //   })) ?? [];
  // }, []);

  const formRef = useRef<GenericFormRef<AddEinheitType>>(null);

  const handleSubmit = () => {
    console.log('Submitted:', { fahrzeug, kraefte: einheiten });
    closeModal();
    const einheitId = formRef.current?.form?.getFieldValue('einheitId');
    return einheitId && addEinheitToEinsatz.mutateAsync({ einheitId });
  };

  const { closeModal, openModal } = useModal();

  const modalConfig = useMemo<ModalConfig>(() => {
    return {
      variant: 'dialog',
      fullWidth: true,
      title: 'Neue Einheiten hinzufügen',
      Icon: PiBell,
      content: (
        <GenericForm<AddEinheitType>
          ref={formRef}
          onSubmit={handleSubmit}
          layout="simple"
          field={{
            name: 'einheitId',
            label: 'Einheit',
            type: 'combo',
            items: einheitenNichtImEinsatzCombo,
          }}
          defaultValues={{
            einheitId: einheiten.data?.find(() => true)?.id ?? '',
          }}
          submitText="Disponieren"
          submitIcon={PiAmbulance}
        />
      ),
    };
  }, [einheitenNichtImEinsatzCombo, einheiten, formRef]);

  return (
    <>
      <div className="pb-2 w-1/2">
        <Button color="orange" className="cursor-pointer" onClick={() => openModal(modalConfig)}>
          Neue Einheiten hinzufügen
        </Button>
      </div>

      {einheitenImEinsatz.isFetched &&
        (einheitenImEinsatz.data?.length ? <EinheitenlisteComponent einheiten={einheitenImEinsatz.data} /> :
          <EmptyEinheitenState />)}
      <EmptyEinheitenState />
    </>
  );
}