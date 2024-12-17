import { useCallback } from 'react';
import { Button, Card, Input } from 'antd';
import { PiAlarm, PiNote } from 'react-icons/pi';
import { InputWrapper } from '../../atoms/InputWrapper.component.js';
import { FormLayout } from '../../organisms/form/FormLayout.comonent.js';
import { useReminders } from '../../../../hooks/reminders.hook.js';
import { CreateNotizDto, OneNoteResponse } from '@bluelight-hub/shared/client/index.js';

type EmptyStateProps = {
  addNote: (note: CreateNotizDto) => Promise<OneNoteResponse> | undefined;
};

export function EmptyState({ addNote }: EmptyStateProps) {
  const { actualCreateReminder } = useReminders();
  const handleSubmit = useCallback(
    async (data: CreateNotizDto & { reminder: boolean }) => {
      await addNote({ content: data.content })?.then((notiz) => {
        if (data.reminder) {
          return actualCreateReminder(notiz.data);
        }
      });
    },
    [addNote, actualCreateReminder],
  );

  return (
    <FormLayout<CreateNotizDto & { reminder: boolean }>
      type="sectioned"
      resetOnSubmit={true}
      form={{
        async onFinish(data) {
          await handleSubmit(data);
        },
      }}
    >
      {(props) => (
        <Card
          classNames={{
            actions: 'bg-green-500',
          }}
          actions={[
            <div className="flex justify-center gap-x-4">
              <Button
                icon={<PiNote />}
                type="primary"
                onClick={async () => {
                  props?.setFieldValue('reminder', false);
                  props?.submit();
                }}
              >
                Notiz anlegen
              </Button>
              <Button
                icon={<PiAlarm />}
                onClick={async () => {
                  props?.setFieldValue('reminder', true);
                  props?.submit();
                }}
              >
                Erinnerung anlegen
              </Button>
            </div>,
          ]}
        >
          <InputWrapper
            name={'content'}
            rules={[
              {
                required: true,
                message: 'Um etwas zu notieren, sollte eine Notiz angegeben werden.',
              },
            ]}
          >
            <Input.TextArea
              name="content"
              rows={5}
              onBlur={() => {
                // do nothing
              }}
              placeholder="Inhalt der Notiz oder Erinnerung"
            />
          </InputWrapper>
        </Card>
      )}
    </FormLayout>
  );
}
