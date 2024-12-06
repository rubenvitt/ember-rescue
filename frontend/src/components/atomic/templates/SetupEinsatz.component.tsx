import React, { useEffect, useMemo } from 'react';
import { SetupEinsatzHeader } from '../molecules/setup-einsatz/Header.component.js';
import { SetupEinsatzOffeneEinsaetze } from '../molecules/setup-einsatz/OffeneEinsaetze.component.js';
import { useEinsatz } from '../../../hooks/einsatz.hook.js';
import { NewSetupEinsatzForm } from '../molecules/setup-einsatz/Form.component.js';
import { getCurrentWindow } from '@tauri-apps/api/window';

export const SetupEinsatzTemplate: React.FC = () => {
  const { offeneEinsaetze } = useEinsatz();
  const einsatzOffen = useMemo(() => offeneEinsaetze.data && offeneEinsaetze.data.data.length > 0, [offeneEinsaetze.data]);

  useEffect(() => {
    let currentWindow = getCurrentWindow();
    currentWindow.setTitleBarStyle('overlay');
    currentWindow.setDecorations(false);
    currentWindow.setShadow(true);
  }, []);

  return (
    <div className="mb-12 flex min-h-screen flex-col items-center gap-4">
      <SetupEinsatzHeader einsatzOffen={einsatzOffen ?? false} />
      <div className="flex w-full max-w-6xl flex-col gap-16 space-y-6">
        {einsatzOffen && <SetupEinsatzOffeneEinsaetze />}
        <NewSetupEinsatzForm />
      </div>
    </div>
  );
};
