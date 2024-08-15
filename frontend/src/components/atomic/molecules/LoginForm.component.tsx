import { Button, Input, Select } from 'antd';
import { PiLock, PiPlus } from 'react-icons/pi';
import { useToggle } from '@reactuses/core';
import { useCallback, useMemo, useState } from 'react';
import { useBearbeiter } from '../../../hooks/bearbeiter.hook.js';
import { useAppWindow } from '../../../hooks/window.hook.js';
import { Windows } from '../../../utils/window.js';
import { BaseOptionType } from 'antd/lib/select/index.js';
import { Bearbeiter } from '../../../types/app/bearbeiter.types.js';

export function LoginForm() {
  const [isCreateUser, toggleCreateUser] = useToggle(false);
  const [bearbeiter, setBearbeiter] = useState('');
  const [selectedBearbeiter, setSelectedBearbeiter] = useState<Bearbeiter>();
  const { saveBearbeiter, allBearbeiter } = useBearbeiter();
  const openWindow = useAppWindow({ appWindow: Windows.APP });

  const onCreateNewBearbeiter = useCallback(async () => {
    setBearbeiter('');
    await saveBearbeiter({ name: bearbeiter, id: null });
    openWindow({ closeOnNavigate: true });
  }, [bearbeiter]);

  const onLoginBearbeiter = useCallback(async () => {
    if (selectedBearbeiter) {
      await saveBearbeiter(selectedBearbeiter);
      openWindow({ closeOnNavigate: true });
    }
  }, [selectedBearbeiter, saveBearbeiter]);

  const allBearbeiterItems = useMemo<BaseOptionType[]>(() => {
    return allBearbeiter.data?.map(b => ({
      title: b.name,
      value: b.name,
      item: b,
    } as BaseOptionType)) ?? [];
  }, [allBearbeiter.data]);

  return <form className="space-y-6" action="#" onSubmit={(event) => {
    event.preventDefault();
    isCreateUser ? onCreateNewBearbeiter() : onLoginBearbeiter();
  }}>
    {
      isCreateUser ? <Input value={bearbeiter} onInput={(e) => setBearbeiter((e.target as any).value)}
                            placeholder="Name des neuen Bearbeiters" /> :
        <Select onSelect={(_, option) => setSelectedBearbeiter(option.item)} options={allBearbeiterItems}
                loading={allBearbeiter.isLoading} placeholder="Bearbeiter auswählen"
                className="w-full" />
    }
    <div className="grid grid-cols-2 justify-items-stretch gap-4">
      {
        isCreateUser
          ? <>
            <Button onClick={toggleCreateUser}>Abbrechen</Button>
            <Button htmlType="submit" onClick={onCreateNewBearbeiter} type="primary"
                    icon={<PiPlus />}>Erstellen</Button>
          </>
          : <>
            <Button onClick={toggleCreateUser} className={'col-span-2'} icon={<PiPlus />}>Neuen Bearbeiter
              erstellen</Button>
            <Button htmlType="submit" className="col-span-2" type={'primary'} icon={<PiLock />}>Anmelden</Button>
          </>
      }
    </div>
  </form>;
}