import { useBearbeiter } from '../../../hooks/bearbeiter.hook.js';
import { PiUser } from 'react-icons/pi';
import { useMemo } from 'react';
import { Menu } from 'antd';
import { MenuItem } from '../../../types/ui/menu.types.js';

interface UserProfileDropdownProps {
  dropdownItems: MenuItem[];
}

export function UserProfileMenu({ dropdownItems }: UserProfileDropdownProps) {
  const { bearbeiter } = useBearbeiter({ requireBearbeiter: true });

  const menuItems = useMemo<MenuItem[]>(() => {
    return [
      {
        label: bearbeiter.data?.name,
        key: 'user',
        icon: <PiUser />,
        children: dropdownItems,
      },
    ];
  }, [bearbeiter.data]);

  return <Menu className="bg-transparent" disabledOverflow={true} mode={'horizontal'} selectedKeys={['']}
               items={menuItems} />;
}