import { format } from 'date-fns';
import { natoDateTime } from '../../../../utils/time.js';
import { useEinsatz } from '../../../../hooks/einsatz.hook.js';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useWindowSetup } from '../../../../hooks/window.hook.js';
import { PiMapPin } from 'react-icons/pi';

export function DefaultDashboard() {
  const { einsatz } = useEinsatz();
  const navigate = useNavigate({ from: '/app/' });

  useWindowSetup({
    title: 'Project Rescue',
    resizable: true,
    fullscreen: process.env.NODE_ENV !== 'development',
  });

  useEffect(() => {
    if (einsatz.isDisabled) navigate({ to: '/setupEinsatz' });
  }, [einsatz.isDisabled]);

  if (einsatz.isLoading) return null;

  const data = einsatz.data;

  if (data)
    return (
      <div>
        <>
          <p className="text-gray-900 dark:text-white">
            Aktueller Einsatz: {data.einsatz_alarmstichwort?.bezeichnung} von {format(data.beginn, natoDateTime)}
          </p>
          <p className="text-gray-500">{data.einsatz_alarmstichwort?.beschreibung}</p>
          <p className="text-gray-500">
            <PiMapPin className="mr-3 inline text-primary-500" />
            {data.einsatz_meta?.ort}
          </p>
        </>
      </div>
    );
}
