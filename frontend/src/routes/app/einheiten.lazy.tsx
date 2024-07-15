import { useMemo, useRef, useState } from 'react';
import { createLazyFileRoute } from '@tanstack/react-router';
import { LayoutApp } from '../_layout/_layout-app.js';
import { Button } from '../../components/catalyst-components/button.js';
import { BellIcon } from '@heroicons/react/24/outline';
import { EinheitenlisteComponent } from '../../components/atomic/organisms/Einheitenliste.component.js';
import { useQualifikationen } from '../../hooks/qualifikationen.hook.js';
import { useEinheiten } from '../../hooks/einheiten.hook.js';
import { EmptyEinheitenState } from '../../components/atomic/molecules/EmptyEinheitenState.component.js';
import { Modal } from '../../components/atomic/molecules/Modal.component.js';
import { ItemType } from '../../components/atomic/molecules/Combobox.component.js';
import { EinheitDto } from '../../types.js';
import { GenericForm, GenericFormRef } from '../../components/atomic/organisms/GenericForm.component.js';

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
  }, []);

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
    setIsModalOpen(false);
    const einheitId = formRef.current?.form?.getFieldValue('einheitId');
    einheitId && addEinheitToEinsatz.mutate({ einheitId });
  };

  return (
    <LayoutApp>
      <Button color="orange" className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
        Neue Einheiten hinzufügen
      </Button>
      <Modal
        variant="panel"
        panelColor="amber"
        isOpen={isModalOpen}
        fullWidth
        onClose={() => setIsModalOpen(false)}
        title="Neue Einheiten hinzufügen"
        Icon={BellIcon}
        content={
          <GenericForm<AddEinheitType> ref={formRef} onSubmit={handleSubmit} layout="simple"
                                       sections={[
                                         {
                                           fields: [{
                                             name: 'einheitId',
                                             label: 'Einheit',
                                             type: 'combo',
                                             items: einheitenNichtImEinsatzCombo,
                                           }],
                                         },
                                       ]} />
        }
        primaryAction={{
          label: 'Hinzufügen',
          onClick: () => handleSubmit(),
          color: 'green',
        }}
        secondaryAction={{
          label: 'Abbrechen',
          onClick: () => setIsModalOpen(false),
          color: 'red',
        }}
      />

      {einheitenImEinsatz.isFetched &&
        (einheitenImEinsatz.data?.length ? <EinheitenlisteComponent einheiten={einheitenImEinsatz.data} /> :
          <EmptyEinheitenState />)}
    </LayoutApp>
  );
}