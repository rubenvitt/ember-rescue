import React, { useCallback } from 'react';
import { formatDate, formatDistanceToNow, formatISO } from 'date-fns';
import { natoDateTime } from '../../../lib/time.js';
import { useBearbeiter } from '../../../hooks/bearbeiter.hook.js';
import { useEinheiten } from '../../../hooks/einheiten.hook.js';
import { useEinsatz } from '../../../hooks/einsatz.hook.js';
import { Badge } from '../../catalyst-components/badge.js';
import { Einsatz } from '../../../types.js';
import { ActionButton, ExpandableList } from '../molecules/ExpandableList.component.tsx';


export const OffeneEinsaetzeList: React.FC = () => {
  const { offeneEinsaetze, einsatzAbschliessen, saveEinsatz } = useEinsatz();
  const { einheiten } = useEinheiten();
  const { allBearbeiter } = useBearbeiter();

  const renderEinsatz = useCallback((einsatz: Einsatz) => {
    const beginnToNow = formatDistanceToNow(einsatz.beginn);

    return (
      <>
        <div className="flex items-start gap-x-3">
          <p className="text-sm font-semibold leading-6 text-gray-900">
            {einsatz.einsatz_alarmstichwort?.bezeichnung || 'Unbekanntes Alarmstichwort'}
          </p>
          <Badge color="blue">Lokaler Einsatz</Badge>
          <Badge color="orange">Remote Einsatz</Badge>
        </div>
        <div className="mt-1 flex flex-col text-xs leading-5 text-gray-500">
          <p>Beginn: <time
            dateTime={formatISO(einsatz.beginn)}>{formatDate(einsatz.beginn, natoDateTime)}</time> (vor {beginnToNow})
          </p>
        </div>
      </>
    );
  }, []);

  const renderExpandedContent = useCallback((einsatz: Einsatz) => {
    const einheit = einheiten.data?.find(value => value.id === einsatz.aufnehmendesRettungsmittelId)?.funkrufname;
    const bearbeiter = allBearbeiter.data?.find(value => value.id === einsatz.bearbeiterId)?.name;

    return (
      <p className="text-sm text-gray-700">
        <p>Erstellt von: {bearbeiter}</p>
        <p>Aufgenommen durch: {einheit}</p>
      </p>
    );
  }, [einheiten.data, allBearbeiter.data]);

  const actionButtons: ActionButton<Einsatz>[] = [
    {
      label: 'Archivieren',
      onClick: () => {
      }, // This is not used when dialog is present
      color: 'red',
      dialog: {
        title: 'Laufenden Einsatz wirklich archivieren?',
        message: 'Der Einsatz wird archiviert und in den Read-Only Modus versetzt. Dies kann nicht rückgängig gemacht werden. Der Einsatz wird in dieser Ansicht versteckt.',
        confirmLabel: 'Einsatz archivieren',
        cancelLabel: 'Abbrechen',
        onConfirm: (einsatz) => einsatzAbschliessen.mutate(einsatz),
      },
    },
    { label: 'Einsatz öffnen', onClick: (einsatz) => saveEinsatz(einsatz), color: 'blue' },
  ];

  return (
    <ExpandableList
      items={offeneEinsaetze.data || []}
      renderItem={renderEinsatz}
      renderExpandedContent={renderExpandedContent}
      actionButtons={actionButtons}
    />
  );
};