import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEinsatz } from './einsatz.hook.js';
import { ReminderDto } from '../types/app/reminders.types.js';
import { services } from '../services/index.js';
import { useCallback, useEffect, useMemo } from 'react';
import { useNotizen } from './notes.hook.js';
import { Bounce, toast } from 'react-toastify';
import { twConfig } from '../styles/tailwindcss.styles.js';
import { PiAlarmBold, PiNote } from 'react-icons/pi';
import { Button, Modal } from 'antd';
import { FormLayout } from '../components/atomic/organisms/form/FormLayout.comonent.js';
import { InputWrapper } from '../components/atomic/atoms/InputWrapper.component.js';
import { DatePicker } from 'formik-antd';
import { addDays, addMinutes } from 'date-fns';
import dayjs from 'dayjs';
import { natoDateTimeAnt } from '../utils/time.js';
import * as Yup from 'yup';

const CreateReminderValidationSchema = Yup.object().shape({
  reminderTime: Yup.date().required()
    .min(addMinutes(new Date(), 1), 'Die Erinnerungszeit kann nicht in der Vergangenheit liegen')
    .max(addDays(new Date(), 1), 'Die Erinnerungszeit ist nicht plausibel'),
});

export function useReminders() {
  const queryClient = useQueryClient();
  const { einsatzId } = useEinsatz();
  const dueReminders = useQuery<ReminderDto[]>({
    queryKey: services.backend.reminders.fetchDueReminders.queryKey({ einsatzId }),
    queryFn: services.backend.reminders.fetchDueReminders.queryFn,
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
    enabled: Boolean(einsatzId),
  });
  const markAsNotified = useMutation({
    mutationKey: services.backend.reminders.postMarkNotified.mutationKey({ einsatzId }),
    mutationFn: services.backend.reminders.postMarkNotified.mutationFn({ einsatzId }),
    onSuccess: services.backend.reminders.invalidateQueries(queryClient),
  });
  const markAsRead = useMutation({
    mutationKey: services.backend.reminders.postMarkRead.mutationKey({ einsatzId }),
    mutationFn: services.backend.reminders.postMarkRead.mutationFn({ einsatzId }),
    onSuccess: services.backend.reminders.invalidateQueries(queryClient),
  });
  const createReminder = useMutation({
    mutationKey: services.backend.reminders.postNewReminder.mutationKey({ einsatzId }),
    mutationFn: services.backend.reminders.postNewReminder.mutationFn({ einsatzId }),
    onSuccess: services.backend.reminders.invalidateQueries(queryClient),
  });
  const { activeNotizen } = useNotizen();
  const submitCreateReminder = useCallback((noteId: string, reminderTime: Date) => {
    return createReminder.mutateAsync({ reminderTime, noteId });
  }, [createReminder.mutate]);

  const actualCreateReminder = useMemo(() => {
    return (noteId: string, props?: { onOk: () => unknown }) => {
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
        content: <div>
          <h2 className="font-bold">Zeitpunkt der Erinnerung</h2>
          <FormLayout<{ reminderTime: string }> form={{ className: 'block mt-2' }} formik={{
            initialValues: {
              reminderTime: addMinutes(new Date(), 10).toISOString(),
            },
            onSubmit: async (data) => {
              await submitCreateReminder(noteId, new Date(data.reminderTime));
              props?.onOk();
              Modal.destroyAll();
            },
            validationSchema: CreateReminderValidationSchema,
          }}>
            {(props) => (<>
              <InputWrapper name="reminderTime">
                <DatePicker showTime format={natoDateTimeAnt} showSecond={false}
                            maxDate={dayjs(addDays(new Date(), 1).toISOString())}
                            minDate={dayjs(addMinutes(new Date(), 1).toISOString())} name="reminderTime" />
              </InputWrapper>
              <Button type="primary" htmlType="submit" onClick={() => props.submitForm()}>Erinnerung erstellen</Button>
            </>)}
          </FormLayout>
        </div>,
      });
    };
  }, []);

  useEffect(() => {
    const relevantNotes = dueReminders.data?.map((reminder) => ({
        note: activeNotizen.data?.find((note) => note.id === reminder.noteId),
        reminder,
      }
    )).filter(pair => Boolean(pair.note && pair.reminder)) ?? [];

    if (relevantNotes.length > 0) {
      relevantNotes.forEach(pair => {
        toast.info(pair.note!.content.slice(0, 100), {
          toastId: pair.reminder!.id,
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          style: { background: twConfig.theme.colors.primary['500'], color: twConfig.theme.colors.white },
          draggable: true,
          progress: undefined,
          data: pair,
          theme: 'light',
          transition: Bounce,
          icon: <PiAlarmBold size={24} />,
          onClose: () => {
            markAsNotified.mutate({
              reminderId: pair.reminder!.id,
              noteId: pair.note!.id,
            });
          },
        });
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