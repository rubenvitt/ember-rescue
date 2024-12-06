import { getAPIConfig } from '../../utils/http.js';
import { createInvalidateQueries } from '../../utils/queries.js';
import { QueryClient } from '@tanstack/react-query';
import { CreateReminderDto, RemindersApi } from '@ember-rescue/shared/client/index.js';
import storage from '../../utils/storage.js';

export const queryKey = 'reminders';

export const invalidateQueries = (queryClient: QueryClient) => createInvalidateQueries([queryKey], queryClient);

const api = new RemindersApi(getAPIConfig());

/// fetch

export const fetchDueReminders = {
  queryKey: (props: { einsatzId: unknown }) => [queryKey, ...[Object.values(props)], 'due'],
  queryFn: function () {
    let missionId = storage().readLocalStorage<string>('einsatz');
    if (!missionId) {
      throw new Error('No missionId found in local storage. Please login and select a mission before fetching reminders.');
    }
    return api.remindersControllerGetDueRemindersV1({
      missionId,
    });
  },
};

// mutate

export const postNewReminder = {
  mutationKey: (props: { einsatzId: unknown }) => [queryKey, ...[Object.values(props)]],
  mutationFn:
    ({ missionId }: { missionId?: string | null }) =>
    async (dto: CreateReminderDto) => {
      if (!missionId) {
        throw new Error('No missionId found in local storage. Please login and select a mission before fetching reminders.');
      }

      return api.remindersControllerCreateReminderV1({
        missionId: missionId,
        createReminderDto: dto,
      });
    },
};

export const postMarkNotified = {
  mutationKey: (props: { einsatzId: unknown }) => [queryKey, ...[Object.values(props), 'notified']],
  mutationFn:
    ({ missionId }: { missionId?: string | null }) =>
    async ({ reminderId }: { reminderId: string }) => {
      if (!missionId) {
        throw new Error('No missionId found in local storage. Please login and select a mission before fetching reminders.');
      }
      return api.remindersControllerMarkAsNotifiedV1({
        missionId: missionId,
        reminderId: reminderId,
      });
    },
};

export const postMarkRead = {
  mutationKey: (props: { einsatzId: unknown }) => [queryKey, ...[Object.values(props), 'read']],
  mutationFn:
    ({ missionId }: { missionId?: string | null }) =>
    async ({ reminderId }: { reminderId: string }) => {
      if (!missionId) {
        throw new Error('No einsatzId found in local storage. Please login and select a mission before fetching reminders.');
      }

      return api.remindersControllerMarkAsReadV1({
        missionId: missionId,
        remindersId: reminderId,
      });
    },
};
