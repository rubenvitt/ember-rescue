import { Button, ButtonProps } from 'antd';

export const ButtonWithShortcut = ({ shortcut, ...rest }: ButtonProps & { shortcut: string }) => (
  <Button {...rest}>
    <span className="flex items-center">
      {rest.children}
      <kbd className="ml-2 rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800">
        {shortcut}
      </kbd>
    </span>
  </Button>
);
