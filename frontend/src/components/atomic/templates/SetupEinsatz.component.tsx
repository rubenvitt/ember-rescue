import React, { useMemo } from 'react';
import { SetupEinsatzHeader } from '../molecules/setup-einsatz/Header.component.js';
import { SetupEinsatzOffeneEinsaetze } from '../molecules/setup-einsatz/OffeneEinsaetze.component.js';
import { useEinsatz } from '../../../hooks/einsatz.hook.js';
import { NewSetupEinsatzForm } from '../molecules/setup-einsatz/Form.component.js';

export const SetupEinsatzTemplate: React.FC = () => {
  const { offeneEinsaetze } = useEinsatz();
  const einsatzOffen = useMemo(() => offeneEinsaetze.data && offeneEinsaetze.data.length > 0, [offeneEinsaetze.data]);

  return (
    <div className="mb-12 flex min-h-screen flex-col items-center gap-4 px-4">
      <div className="flex w-full max-w-6xl flex-col gap-16 space-y-6">
        <SetupEinsatzHeader einsatzOffen={einsatzOffen ?? false} />
        {einsatzOffen && <SetupEinsatzOffeneEinsaetze />}
        <NewSetupEinsatzForm />
      </div>
    </div>
  );
};
