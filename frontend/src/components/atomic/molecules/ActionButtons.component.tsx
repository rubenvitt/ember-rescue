import { ActionButton } from '../../../types/ui/expandableList.types.js';
import { Button, Modal } from 'antd';

const { confirm } = Modal;

export const ActionButtons = <T,>({ buttons, item }: { buttons: ActionButton<T>[]; item: T }) => (
  <div className="mt-3 flex justify-end space-x-3">
    {buttons.map((button) =>
      button.dialog ? (
        <Button
          danger={button.danger}
          onClick={() => {
            confirm({
              title: button.dialog?.title,
              content: button.dialog?.message,
              okText: button.dialog?.confirmLabel,
              cancelText: button.dialog?.cancelLabel,
              onOk: () => button.dialog?.onConfirm(item),
              type: 'warning',
              closable: true,
              maskClosable: true,
              okButtonProps: {
                danger: button.danger,
              },
            });
          }}
          type="dashed"
        >
          {button.label}
        </Button>
      ) : (
        <Button key={button.label} danger={button.danger} onClick={() => button.onClick(item)} type="primary">
          {button.label}
        </Button>
      ),
    )}
  </div>
);
