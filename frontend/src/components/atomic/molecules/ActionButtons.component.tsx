import { FlexibleDialog } from './Dialog.js';
import { ActionButton } from '../../../types/ui/expandableList.types.js';
import { Button } from 'antd';

export const ActionButtons = <T, >({ buttons, item }: { buttons: ActionButton<T>[], item: T }) => (
  <div className="mt-3 flex justify-end space-x-3">
    {buttons.map((button) =>
      button.dialog ? (
        <FlexibleDialog
          key={button.label}
          variant="critical"
          size="md"
          actions={[
            { label: button.dialog.cancelLabel },
            {
              onClick: () => button.dialog!.onConfirm(item),
              label: button.dialog.confirmLabel,
              variant: 'error',
              primary: true,
            },
          ]}
          message={button.dialog.message}
          title={button.dialog.title}
        >
          {({ open }) => (
            <Button onClick={open} type="dashed">
              {button.label}
            </Button>
          )}
        </FlexibleDialog>
      ) : (
        <Button key={button.label} onClick={() => button.onClick(item)} type="primary">
          {button.label}
        </Button>
      ),
    )}
  </div>
);