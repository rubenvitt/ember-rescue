import { backendFetchJson } from '../../utils/http.js';
import { createInvalidateQueries, requireParams } from '../../utils/queries.js';
import { QueryClient } from '@tanstack/react-query';
import { ReminderDto } from '../../types/app/reminders.types.js';

export const queryKey = 'reminders';

export const invalidateQueries = (queryClient: QueryClient) => createInvalidateQueries([queryKey], queryClient);

/// fetch

export const fetchDueReminders = {
  queryKey: (props: { einsatzId: unknown }) => [queryKey, ...[Object.values(props)], 'due'],
  queryFn: function () {
    return backendFetchJson<ReminderDto[]>('reminders/due');
  },
};

// mutate

export const postNewReminder = {
  mutationKey: (props: { einsatzId: unknown }) => [queryKey, ...[Object.values(props)]],
  mutationFn:
    ({ einsatzId }: { einsatzId?: string | null }) =>
    async ({ reminderTime, noteId }: { reminderTime: Date; noteId: string }) => {
      requireParams(einsatzId, reminderTime, noteId);
      return await backendFetchJson(`reminders`, {
        body: JSON.stringify({
          noteId,
          reminderTime,
        }),
        method: 'POST',
      });
    },
};

export const postMarkNotified = {
  mutationKey: (props: { einsatzId: unknown }) => [queryKey, ...[Object.values(props), 'notified']],
  mutationFn:
    ({ einsatzId }: { einsatzId?: string | null }) =>
    async ({ noteId, reminderId }: { reminderId: string; noteId?: string }) => {
      requireParams(einsatzId, noteId);
      return await backendFetchJson(`reminders/${reminderId}/mark-notified`, {
        method: 'POST',
      });
    },
};

export const postMarkRead = {
  mutationKey: (props: { einsatzId: unknown }) => [queryKey, ...[Object.values(props), 'read']],
  mutationFn:
    ({ einsatzId }: { einsatzId?: string | null }) =>
    async ({ noteId, reminderId }: { noteId?: string; reminderId: string }) => {
      requireParams(einsatzId, noteId);
      return await backendFetchJson(`reminders/${reminderId}/mark-read`, {
        method: 'POST',
      });
    },
};
