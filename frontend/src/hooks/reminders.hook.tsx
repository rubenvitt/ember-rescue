import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEinsatz } from './einsatz.hook.js';
import { services } from '../services/index.js';
import { useCallback, useEffect, useMemo } from 'react';
import { Bounce, toast } from 'react-toastify';
import { twConfig } from '../styles/tailwindcss.styles.js';
import { PiAlarmBold, PiNote } from 'react-icons/pi';
import { Button, Modal } from 'antd';
import { FormLayout } from '../components/atomic/organisms/form/FormLayout.comonent.js';
import { InputWrapper } from '../components/atomic/atoms/InputWrapper.component.js';
import { DatePicker, Input } from 'formik-antd';
import { addDays, addMinutes, formatISO } from 'date-fns';
import dayjs from 'dayjs';
import { natoDateTimeAnt } from '../utils/time.js';
import * as Yup from 'yup';
import { ManyReminderResponse } from '@ember-rescue/shared/client/index.js';
import { NotizDto } from '../types/app/notes.types.js';

const CreateReminderValidationSchema = Yup.object().shape({
  reminderTime: Yup.date()
    .required()
    .min(addMinutes(new Date(), 1), 'Die Erinnerungszeit kann nicht in der Vergangenheit liegen')
    .max(addDays(new Date(), 1), 'Die Erinnerungszeit ist nicht plausibel'),
});

export function useReminders() {
  const queryClient = useQueryClient();
  const { einsatzId } = useEinsatz();
  const dueReminders = useQuery<ManyReminderResponse>({
    queryKey: services.backend.reminders.fetchDueReminders.queryKey({ einsatzId }),
    queryFn: services.backend.reminders.fetchDueReminders.queryFn,
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
    enabled: Boolean(einsatzId),
  });
  const markAsNotified = useMutation({
    mutationKey: services.backend.reminders.postMarkNotified.mutationKey({ einsatzId }),
    mutationFn: services.backend.reminders.postMarkNotified.mutationFn({ missionId: einsatzId }),
    onSuccess: services.backend.reminders.invalidateQueries(queryClient),
  });
  const markAsRead = useMutation({
    mutationKey: services.backend.reminders.postMarkRead.mutationKey({ einsatzId }),
    mutationFn: services.backend.reminders.postMarkRead.mutationFn({ missionId: einsatzId }),
    onSuccess: services.backend.reminders.invalidateQueries(queryClient),
  });
  const createReminder = useMutation({
    mutationKey: services.backend.reminders.postNewReminder.mutationKey({ einsatzId }),
    mutationFn: services.backend.reminders.postNewReminder.mutationFn({ missionId: einsatzId }),
    onSuccess: services.backend.reminders.invalidateQueries(queryClient),
  });
  const submitCreateReminder = useCallback(
    (content: string, action: string, title: string, reminderTime: Date) => {
      return createReminder.mutateAsync({
        content,
        action,
        title,
        timestamp: formatISO(reminderTime),
      });
    },
    [createReminder.mutate],
  );

  const actualCreateReminder = useMemo(() => {
    return (note: NotizDto, props?: { onOk: () => unknown }) => {
      console.log('creating reminder');
      Modal.confirm({
        icon: <PiNote size={24} />,
        okButtonProps: {
          className: 'hidden',
        },
        cancelButtonProps: {
          className: 'hidden',
        },
        type: 'confirm',
        maskClosable: true,
        closable: true,
        content: (
          <div>
            <h2 className="font-bold">Zeitpunkt der Erinnerung</h2>
            <FormLayout<{ reminderTime: string; message: string }>
              form={{ className: 'block mt-2' }}
              formik={{
                initialValues: {
                  reminderTime: addMinutes(new Date(), 10).toISOString(),
                  message: '',
                },
                onSubmit: async (data) => {
                  await submitCreateReminder(data.message, 'note:' + note.id, note.content, new Date(data.reminderTime));
                  props?.onOk();
                  Modal.destroyAll();
                },
                validationSchema: CreateReminderValidationSchema,
              }}
            >
              {(props) => (
                <>
                  <InputWrapper name="reminderTime" label="Erinnerungszeit">
                    <DatePicker
                      showTime
                      format={natoDateTimeAnt}
                      showSecond={false}
                      maxDate={dayjs(addDays(new Date(), 1).toISOString())}
                      minDate={dayjs(addMinutes(new Date(), 1).toISOString())}
                      name="reminderTime"
                    />
                  </InputWrapper>
                  <InputWrapper name="message" label="Eigene Notiz">
                    <Input name="message" />
                  </InputWrapper>
                  <Button type="primary" htmlType="submit" onClick={() => props.submitForm()}>
                    Erinnerung erstellen
                  </Button>
                </>
              )}
            </FormLayout>
          </div>
        ),
      });
    };
  }, []);

  useEffect(() => {
    if ((dueReminders.data?.meta.pagination.total ?? 0) > 0) {
      dueReminders.data?.data.forEach((reminder) => {
        toast.info(
          <div>
            <strong>{reminder.title}</strong>
            <p>{reminder.content}</p>
          </div>,
          {
            toastId: reminder.id,
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            style: { background: twConfig.theme.colors.primary['500'], color: twConfig.theme.colors.white },
            draggable: true,
            progress: undefined,
            data: reminder,
            theme: 'light',
            transition: Bounce,
            icon: <PiAlarmBold size={24} />,
            onClose: () => {
              markAsNotified.mutate({
                reminderId: reminder.id,
              });
            },
          },
        );
      });
      new Audio('/sounds/notification.mp3').play();
    }
  }, [dueReminders.data]);

  return {
    dueReminders,
    markAsNotified,
    markAsRead,
    createReminder,
    actualCreateReminder,
  };
}
