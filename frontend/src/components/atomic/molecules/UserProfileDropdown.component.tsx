import { useBearbeiter } from '../../../hooks/bearbeiter.hook.js';
import { DropdownItems } from '../../../types.js';
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '../../catalyst-components/dropdown.js';
import { UserIcon } from '@heroicons/react/24/outline/index.js';

export function UserProfileDropdownComponent({ dropdownItems }: { dropdownItems: DropdownItems }) {
  const { bearbeiter } = useBearbeiter();

  return <Dropdown>
    <DropdownButton className="flex items-center p-1.5 cursor-pointer" plain={true}>
      <span className="sr-only">Open user menu</span>
      <span className="w-5"><UserIcon aria-hidden="true" /></span>
      <span className="text-sm font-semibold" aria-hidden="true">
        {bearbeiter?.name}
                      </span>
    </DropdownButton>
    <DropdownMenu
      transition
      className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
    >
      {dropdownItems.map((item) => {
        if (item['href']) {
          return <DropdownItem
            href={item['href']}
            key={item.name}
          >
            <item.icon className="w-5 h-5 mr-2" />
            <DropdownLabel>{item.name}</DropdownLabel>
          </DropdownItem>;
        }
        return <DropdownItem
          key={item.name}
          onClick={item.onClick}
        >
          <item.icon className="w-5 h-5 mr-2" />
          <DropdownLabel>{item.name}</DropdownLabel>
        </DropdownItem>;
      })}
    </DropdownMenu>
  </Dropdown>;
}


// <MenuItem key={item.name}>
//   {({ focus }) => (
//     <Link
//       to={item.href}
//       className={clsx(
//         focus ? 'bg-gray-50' : '',
//         'block px-3 py-1 text-sm leading-6 text-gray-900',
//       )}
//     >
//       {item.name}
//     </Link>
//   )}
// </MenuItem>