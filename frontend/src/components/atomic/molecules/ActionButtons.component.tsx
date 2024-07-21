import { Button } from './Button.component.tsx';
import { FlexibleDialog } from './Dialog.js';
import { ActionButton } from '../../../types/expandableList.types.js';

export const ActionButtons = <T, >({ buttons, item }: { buttons: ActionButton<T>[], item: T }) => (
  <div className="mt-3 flex justify-end space-x-3">
    {buttons.map((button, index) =>
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
            <Button onClick={open} color={button.color}>
              {button.label}
            </Button>
          )}
        </FlexibleDialog>
      ) : (
        <Button key={button.label} onClick={() => button.onClick(item)} color={button.color}>
          {button.label}
        </Button>
      ),
    )}
  </div>
);