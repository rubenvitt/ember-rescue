import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEinsatz } from './einsatz.hook.js';
import { ReminderDto } from '../types/app/reminders.types.js';
import { services } from '../services/index.js';
import { useEffect } from 'react';
import { useNotizen } from './notes.hook.js';
import { Bounce, toast } from 'react-toastify';
import { twConfig } from '../styles/tailwindcss.styles.js';
import { PiAlarmBold } from 'react-icons/pi';

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
      new Audio("/sounds/notification.mp3").play()
    }
  }, [dueReminders.data]);

  return {
    dueReminders,
    markAsNotified,
    markAsRead,
    createReminder,
  };
}