import React, { useMemo, useRef, useState } from 'react';
import { createLazyFileRoute } from '@tanstack/react-router';
import { LayoutApp } from '../_layout/_layout-app.js';
import { EinheitenlisteComponent } from '../../components/atomic/organisms/Einheitenliste.component.js';
import { useQualifikationen } from '../../hooks/qualifikationen.hook.js';
import { useEinheiten } from '../../hooks/einheiten/einheiten.hook.js';
import { EmptyEinheitenState } from '../../components/atomic/molecules/EmptyEinheitenState.component.js';
import { ItemType } from '../../components/atomic/molecules/Combobox.component.js';
import { EinheitDto } from '../../types/types.js';
import { GenericForm, GenericFormRef } from '../../components/atomic/organisms/GenericForm.component.js';
import { Button } from '../../components/atomic/molecules/Button.component.tsx';
import { PiBell } from 'react-icons/pi';
import { useModal } from '../../hooks/modal.hook.js';
import { ModalConfig } from '../../types/modalTypes.js';

export const Route = createLazyFileRoute('/app/einheiten')({
  component: Einheiten,
});

type AddEinheitType = {
  einheitId: string
}

function Einheiten() {
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleAddKraft = () => {
  };
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
          sections={[
            {
              fields: [{
                name: 'einheitId',
                label: 'Einheit',
                type: 'combo',
                items: einheitenNichtImEinsatzCombo,
              }],
            },
          ]}
          defaultValues={{
            einheitId: einheiten.data?.find(() => true)?.id ?? '',
          }}
        />
      ),
    };
  }, []);

  return (
    <LayoutApp>
      <Button color="orange" className="cursor-pointer" onClick={() => openModal(modalConfig)}>
        Neue Einheiten hinzufügen
      </Button>

      {einheitenImEinsatz.isFetched &&
        (einheitenImEinsatz.data?.length ? <EinheitenlisteComponent einheiten={einheitenImEinsatz.data} /> :
          <EmptyEinheitenState />)}
      <EmptyEinheitenState />
    </LayoutApp>
  );
}