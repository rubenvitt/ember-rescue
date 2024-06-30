import { useState } from 'react';
import { createLazyFileRoute } from '@tanstack/react-router';
import { LayoutApp } from '../_layout/_layout-app.js';
import ModalComponent from '../../components/atomic/molecules/Modal.component.js';
import { Button } from '../../components/catalyst-components/button.js';
import { Input } from '../../components/catalyst-components/input.js';
import { Select } from '../../components/catalyst-components/select.js';
import { Field, Label } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/24/outline';
import { EinheitenlisteComponent } from '../../components/atomic/organisms/Einheitenliste.component.js';
import { useQualifikationen } from '../../hooks/qualifikationen.hook.js';
import { useEinheiten } from '../../hooks/einheiten.hook.js';
import { EmptyEinheitenState } from '../../components/atomic/molecules/EmptyEinheitenState.component.js';

export const Route = createLazyFileRoute('/app/einheiten')({
  component: Einheiten,
});

function Einheiten() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fahrzeug, setFahrzeug] = useState('');
  const { qualifikationen } = useQualifikationen();
  const { einheiten } = useEinheiten({ einsatzId: '11' });

  const handleAddKraft = () => {

  };


  const handleSubmit = () => {
    console.log('Submitted:', { fahrzeug, kraefte: einheiten });
    setIsModalOpen(false);
    // Here you would typically send this data to your backend or state management
  };

  return (
    <LayoutApp>
      <Button color="orange" className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
        Neue Einheiten hinzufügen
      </Button>
      <ModalComponent
        isOpen={isModalOpen}
        fullWidth
        onClose={() => setIsModalOpen(false)}
        title="Neue Einheiten hinzufügen"
        Icon={BellIcon}
        content={
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field>
              <Label>Fahrzeug/Einheit</Label>
              <Input
                value={fahrzeug}
                onChange={(e) => setFahrzeug(e.target.value)}
                required
              />
            </Field>
            {([] as any[]).map((kraft, index) => (
              <div key={index} className="flex space-x-2">
                <Field>
                  <Label>
                    Name Kraft {index + 1}
                  </Label>
                  <Input
                    value={kraft.name}
                    // onChange={(e) => handleKraftChange(index, 'name', e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <Label>
                    Qualifikation Kraft {index + 1}
                  </Label>
                  <Select
                    value={kraft.qualifikation}
                    // onChange={(e) => handleKraftChange(index, 'qualifikation', e.target.value)}
                    required
                  >
                    <option value="">Bitte wählen</option>
                    {qualifikationen.data?.map((qual) => (
                      <option key={qual.id} value={qual.id}>{qual.bezeichnung}</option>
                    ))}
                  </Select>
                </Field>
              </div>
            ))}
            <Button type="button" onClick={handleAddKraft} color="blue">
              Weitere Kraft hinzufügen
            </Button>
          </form>
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

      {einheiten.isFetched &&
        (einheiten.data?.length ? <EinheitenlisteComponent einheiten={einheiten.data} /> : <EmptyEinheitenState />)}
    </LayoutApp>
  );
}