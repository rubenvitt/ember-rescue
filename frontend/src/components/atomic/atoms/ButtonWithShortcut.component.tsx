import { Button, ButtonProps } from 'antd';

export const ButtonWithShortcut = ({ shortcut, ...rest }: ButtonProps & { shortcut: string }) => (
  <Button
    {...rest}
  >
    <span className="flex items-center">
      {rest.children}
      <kbd
        className="ml-2 px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
        {shortcut}
      </kbd>
    </span>
  </Button>
);
