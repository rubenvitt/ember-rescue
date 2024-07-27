import React, { useCallback, useMemo } from 'react';
import { formatDate, formatDistanceToNow, formatISO } from 'date-fns';
import { natoDateTime } from '../../../utils/time.js';
import { useBearbeiter } from '../../../hooks/bearbeiter.hook.js';
import { useEinheiten } from '../../../hooks/einheiten/einheiten.hook.js';
import { useEinsatz } from '../../../hooks/einsatz.hook.js';
import { Badge } from '../atoms/Badge.component.js';
import { ExpandableList } from './ExpandableList.component.tsx';
import { ActionButton } from '../../../types/ui/expandableList.types.js';
import { Einsatz } from '../../../types/app/einsatz.types.js';

export const OffeneEinsaetzeList: React.FC = () => {
  const { offeneEinsaetze, einsatzAbschliessen, saveEinsatz } = useEinsatz();
  const { einheiten } = useEinheiten();
  const { allBearbeiter } = useBearbeiter();

  const renderEinsatz = useCallback((einsatz: Einsatz) => {
    const beginnToNow = formatDistanceToNow(einsatz.beginn);

    return (
      <div className="flex flex-col">
        <div className="flex items-start gap-x-3">
          <p className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
            {einsatz.einsatz_alarmstichwort?.bezeichnung ?? 'Unbekanntes Alarmstichwort'}
          </p>
          <Badge color="blue">Lokaler Einsatz</Badge>
          <Badge color="orange">Remote Einsatz</Badge>
        </div>
        <div className="mt-1 text-right flex flex-col text-xs leading-5 text-blue-800 dark:text-blue-300">
          <p>
            Beginn:{' '}
            <time dateTime={formatISO(einsatz.beginn)}>
              {formatDate(einsatz.beginn, natoDateTime)}
            </time>
            {' '}
            (Laufzeit bisher: {beginnToNow})
          </p>
        </div>
      </div>
    );
  }, []);

  const renderExpandedContent = useCallback((einsatz: Einsatz) => {
    const einheit = einheiten.data?.find(value => value.id === einsatz.aufnehmendesRettungsmittelId)?.funkrufname;
    const bearbeiter = allBearbeiter.data?.find(value => value.id === einsatz.bearbeiterId)?.name;

    return (
      <div className="text-sm text-gray-700 dark:text-gray-300">
        <p>Erstellt von: {bearbeiter ?? 'Unbekannt'}</p>
        <p>Aufgenommen durch: {einheit ?? 'Unbekannt'}</p>
      </div>
    );
  }, [einheiten.data, allBearbeiter.data]);

  const actionButtons: ActionButton<Einsatz>[] = useMemo(() => [
    {
      label: 'Archivieren',
      color: 'red',
      dialog: {
        title: 'Laufenden Einsatz wirklich archivieren?',
        message: 'Der Einsatz wird archiviert und in den Read-Only Modus versetzt. Dies kann nicht rückgängig gemacht werden. Der Einsatz wird in dieser Ansicht versteckt.',
        confirmLabel: 'Einsatz archivieren',
        cancelLabel: 'Abbrechen',
        onConfirm: (einsatz) => einsatzAbschliessen.mutate(einsatz),
      },
    },
    {
      label: 'Einsatz öffnen',
      onClick: (einsatz) => saveEinsatz(einsatz),
      color: 'blue',
    },
  ], [einsatzAbschliessen, saveEinsatz]);

  return (
    <ExpandableList<Einsatz>
      items={offeneEinsaetze.data ?? []}
      renderItem={renderEinsatz}
      renderExpandedContent={renderExpandedContent}
      actionButtons={actionButtons}
    />
  );
};