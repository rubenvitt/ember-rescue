import { useBearbeiter } from '../../../hooks/bearbeiter.hook.js';
import { PiUser } from 'react-icons/pi';
import { DropdownItemType, GenericDropdown } from './GenericDropdown.component.js';
import { useMemo } from 'react';

interface UserProfileDropdownProps {
  dropdownItems: DropdownItemType[];
}

export function UserProfileDropdown({ dropdownItems }: UserProfileDropdownProps) {
  const { bearbeiter } = useBearbeiter({ requireBearbeiter: true });
  const buttonContent = useMemo(() => (
    <>
      <span className="sr-only">Benutzermenü öffnen</span>
      <PiUser size={24} aria-hidden="true" />
      <span className="ml-2 text-sm font-semibold" aria-hidden="true">
        {JSON.stringify(bearbeiter.data)}
        {bearbeiter.data?.name}
      </span>
    </>
  ), [bearbeiter.data]);

  return (
    <GenericDropdown
      buttonContent={buttonContent}
      dropdownItems={dropdownItems}
    />
  );
}