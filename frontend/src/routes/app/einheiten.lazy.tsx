import { useMemo, useRef } from 'react';
import { createLazyFileRoute } from '@tanstack/react-router';
import { EinheitenlisteComponent } from '../../components/atomic/organisms/Einheitenliste.component.js';
import { useEinheiten } from '../../hooks/einheiten/einheiten.hook.js';
import { AddEinheiten } from '../../components/atomic/molecules/AddEinheiten.component.js';
import { ItemType } from '../../components/atomic/molecules/Combobox.component.js';
import { GenericForm } from '../../components/atomic/organisms/GenericForm.component.js';
import { PiAmbulance, PiBell } from 'react-icons/pi';
import { useModal } from '../../hooks/modal.hook.js';
import { ModalConfig } from '../../types/ui/modal.types.js';
import { GenericFormRef } from '../../types/ui/form.types.js';
import { Button } from '../../components/atomic/molecules/Button.component.tsx';
import { EinheitDto } from '../../types/app/einheit.types.js';

export const Route = createLazyFileRoute('/app/einheiten')({
  component: Einheiten,
});

type AddEinheitType = {
  einheitId: string
}

function Einheiten() {
  //const { qualifikationen } = useQualifikationen();
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
    console.log('Submitted:', { kraefte: einheiten });
    closeModal();
    // TODO: Kräfte should be handled here, too
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
      content: (<div className="mb-24">
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
        </div>
      ),
    };
  }, [einheitenNichtImEinsatzCombo, einheiten, formRef]);

  return (
    <>
      <div className="pb-2 w-1/2">
        <Button className="cursor-pointer" onClick={() => openModal(modalConfig)}>
          Neue Einheiten hinzufügen
        </Button>
      </div>

      {einheitenImEinsatz.data?.length && <EinheitenlisteComponent einheiten={einheitenImEinsatz.data} />}
      <AddEinheiten classNameContainer="mt-12" />
    </>
  );
}