import React from 'react';
import { useEinsatz } from '../../../hooks/einsatz.hook.js';
import { useInterval } from '../../../hooks/functions.hook.js';
import { format } from 'date-fns';
import { natoDateTime } from '../../../utils/time.js';
import FireAlarmIcon from '../../../assets/icons/icons8-fire-alarm.svg?react';

export const EinsatzInfoComponent: React.FC = () => {
  const { einsatz } = useEinsatz();
  const time = useInterval(() => format(new Date(), natoDateTime), 300, []);

  return (
    <div className="mt-4 flex h-16 shrink-0 items-start gap-4">
      <FireAlarmIcon className="mt-1 h-8 w-auto text-white" />
      <div>
        <h3 className="text-base font-bold leading-6 text-white">
          Laufend: {einsatz.data?.einsatz_alarmstichwort?.bezeichnung}
        </h3>
        <p className="-mt-0.5 text-sm text-gray-200">
          Beginn: {einsatz.data?.beginn && format(einsatz.data?.beginn, natoDateTime)}
          <br />
          Aktuell: <b>{time}</b>
        </p>
      </div>
    </div>
  );
};
