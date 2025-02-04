import { Button, Modal } from 'antd';
import { ActionButton } from '../../../types/ui/expandableList.types.js';

const { confirm } = Modal;

export const ActionButtons = <T,>({ buttons, item }: { buttons: (item: T) => ActionButton[]; item: T }) => (
  <div className="mt-3 flex justify-end space-x-3">
    {buttons(item).map((button) =>
      button.dialog ? (
        <Button
          danger={button.danger}
          onClick={() => {
            confirm({
              title: button.dialog?.title,
              content: button.dialog?.message,
              okText: button.dialog?.confirmLabel,
              cancelText: button.dialog?.cancelLabel,
              onOk: () => button.dialog?.onConfirm(),
              type: 'warning',
              closable: true,
              maskClosable: true,
              okButtonProps: {
                danger: button.danger,
              },
            });
          }}
          disabled={button.disabled}
          type="dashed"
        >
          {button.label}
        </Button>
      ) : (
        <Button key={button.label} danger={button.danger} onClick={() => button.onClick()} type="primary" disabled={button.disabled}>
          {button.label}
        </Button>
      ),
    )}
  </div>
);
