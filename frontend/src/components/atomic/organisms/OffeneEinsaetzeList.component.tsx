import { SmallMissionDto } from '@bluelight-hub/shared/client/index.js';
import { List, Tag } from 'antd';
import { formatDistanceToNow, formatISO } from 'date-fns';
import { useCallback } from 'react';
import { PiCheck, PiCodeBold, PiNetwork, PiX } from 'react-icons/pi';
import { useBearbeiter } from '../../../hooks/bearbeiter.hook.js';
import { useEinsatz } from '../../../hooks/einsatz.hook.js';
import { useFahrzeuge } from '../../../hooks/fahrzeuge/fahrzeuge.hook.js';
import { listStyles } from '../../../styles/expandableList.styles.js';
import { ActionButton } from '../../../types/ui/expandableList.types.ts';
import { formatNatoDateTime } from '../../../utils/time.js';
import { OptaTooltip } from '../atoms/OptaTooltip.component.tsx';
import { ExpandableListItem } from '../molecules/ExpandableListItem.component.js';

export const OffeneEinsaetzeList: React.FC = () => {
  const { offeneEinsaetze, einsatzAbschliessen, saveEinsatz } = useEinsatz(false);
  const { fahrzeuge } = useFahrzeuge();
  const { allBearbeiter } = useBearbeiter();

  const renderEinsatz = useCallback((einsatz: SmallMissionDto) => {
    const beginnToNow = formatDistanceToNow(einsatz.beginn);

    return (
      <div className="flex flex-col">
        <div className="flex items-start gap-x-3">
          <p className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">Stichwort: {einsatz.einsatzAlarmstichwort.code}</p>
          <Tag icon={<PiNetwork className="mr-1 inline" />} color="blue">
            Remote-Einsatz
          </Tag>
          <Tag icon={<PiCodeBold className="mr-1 inline" />} color="cyan">
            Version: {einsatz.backendVersion ?? 'Unbekannt'}
          </Tag>
          <Tag icon={einsatz.backendCompatible ? <PiCheck className="mr-1 inline" /> : <PiX className="mr-1 inline" />} color={einsatz.backendCompatible ? 'green' : 'red'}>
            {einsatz.backendCompatible ? 'Kompatibel' : 'Nicht kompatibel'}
          </Tag>
        </div>
        <div className="mt-1 flex flex-col text-right text-xs leading-5 text-blue-800 dark:text-blue-300">
          <p>
            Beginn: <time dateTime={formatISO(einsatz.beginn)}>{formatNatoDateTime(einsatz.beginn)}</time> (Laufzeit bisher: {beginnToNow})
          </p>
        </div>
      </div>
    );
  }, []);

  const renderExpandedContent = useCallback(
    (einsatz: SmallMissionDto) => {
      const fahrzeug = einsatz.aufnehmendesRettungsmittel;
      const bearbeiter = einsatz.bearbeiter.name;

      return (
        <div className="text-sm text-gray-700 dark:text-gray-300">
          <p>Erstellt von: {bearbeiter ?? 'Unbekannt'}</p>
          <OptaTooltip fullOpta={fahrzeug ?? 'Unbekannt'} />
        </div>
      );
    },
    [fahrzeuge.data, allBearbeiter.data],
  );

  const actionButtons = useCallback((einsatz: SmallMissionDto) => [
    {
      label: 'Archivieren',
      danger: true,
      dialog: {
        title: 'Laufenden Einsatz wirklich archivieren?',
        message: 'Der Einsatz wird archiviert und in den Read-Only Modus versetzt. Dies kann nicht rückgängig gemacht werden. Der Einsatz wird in dieser Ansicht versteckt.',
        confirmLabel: 'Einsatz archivieren',
        cancelLabel: 'Abbrechen',
        onConfirm: () => einsatzAbschliessen.mutate(einsatz),
      },
    },
    {
      label: 'Einsatz öffnen',
      onClick: () => saveEinsatz(einsatz),
      color: 'blue' as const,
      disabled: !einsatz.backendCompatible,
    },
  ] as ActionButton[],
    [einsatzAbschliessen, saveEinsatz],
  );

  return (
    <>
      <List
        className={listStyles()}
        itemLayout="horizontal"
        dataSource={offeneEinsaetze.data?.data}
        renderItem={(item) => <ExpandableListItem item={item} renderContent={renderEinsatz} renderExpandedContent={renderExpandedContent} actionButtons={actionButtons} />}
      />
    </>
  );
};
