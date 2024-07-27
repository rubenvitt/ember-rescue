import React, { useMemo } from 'react';
import { SetupEinsatzHeader } from '../molecules/setup-einsatz/Header.component.js';
import { SetupEinsatzOffeneEinsaetze } from '../molecules/setup-einsatz/OffeneEinsaetze.component.js';
import { SetupEinsatzForm } from '../molecules/setup-einsatz/Form.component.js';
import { useEinsatz } from '../../../hooks/einsatz.hook.js';

export const SetupEinsatzTemplate: React.FC = () => {
  const { offeneEinsaetze } = useEinsatz();
  const einsatzOffen = useMemo(() => offeneEinsaetze.data && offeneEinsaetze.data.length > 0, [offeneEinsaetze.data]);

  return (
    <div className="flex gap-4 flex-col items-center min-h-screen">
      <div className="w-full max-w-6xl flex flex-col gap-16 space-y-6">
        <SetupEinsatzHeader einsatzOffen={einsatzOffen ?? false} />
        {einsatzOffen && <SetupEinsatzOffeneEinsaetze />}
        <SetupEinsatzForm />
      </div>
    </div>
  );
};
