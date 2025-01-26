import { Collapse } from 'antd';
import { ItemType } from 'rc-collapse/es/interface.js';
import { useMemo } from 'react';
import { useNotizen } from '../../../hooks/notes.hook.js';
import { NotizenList } from '../organisms/NotizenList.component.js';

export function NotizenTemplate() {
  const { activeNotizen, createNotiz, archivedNotizen } = useNotizen();

  const items = useMemo<ItemType[]>(() => {
    return [
      {
        label: 'Abgeschlossene Notizen',
        children: <NotizenList loading={archivedNotizen.isLoading} notizen={archivedNotizen.data?.data} />,
      },
    ];
  }, [archivedNotizen.data?.data, archivedNotizen.isLoading]);

  return (
    <div>
      <NotizenList loading={activeNotizen.isLoading} notizen={activeNotizen.data?.data} addNotiz={createNotiz.mutateAsync} />
      {archivedNotizen.data?.data && archivedNotizen.data.data.length > 0 && <Collapse className="mt-8 flex flex-col gap-8" items={items} />}
    </div>
  );
}
