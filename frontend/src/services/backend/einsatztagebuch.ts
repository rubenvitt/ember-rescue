import { getAPIConfig } from '../../utils/http.js';
import { createInvalidateQueries } from '../../utils/queries.js';
import { QueryClient } from '@tanstack/react-query';
import { CreateJournalEntryDto, JournalApi } from '@ember-rescue/shared/client/index.js';

export const queryKey = 'einsatztagebuch';
export const invalidateQueries = (queryClient: QueryClient) => createInvalidateQueries([queryKey], queryClient);

const api = new JournalApi(getAPIConfig());

// GET All EinsatztagebuchEinträge
export const fetchAllEinsatztagebuchEintraege = {
  queryKey: ({ missionId }: { missionId: unknown }) => [queryKey, missionId],
  queryFn: ({ missionId }: { missionId: string | null }) =>
    function () {
      if (!missionId) {
        throw new Error('No missionId found in local storage. Please login and select a mission before fetching einsatztagebuch.');
      }
      return api.journalControllerGetJournalV1({
        missionId,
      });
    },
};

// POST New EinsatztagebuchEintrag
export const createEinsatztagebuchEintrag = {
  mutationKey: ({ missionId }: { missionId: unknown }) => [queryKey, missionId, 'add'],
  mutationFn:
    ({ missionId }: { missionId: string | null }) =>
    async (createJournalEntryDto: CreateJournalEntryDto) => {
      if (!missionId) {
        throw new Error('No missionId found in local storage. Please login and select a mission before fetching einsatztagebuch.');
      }
      return api.journalControllerCreateJournalEntryV1({
        missionId,
        createJournalEntryDto,
      });
    },
};

// POST Archive EinsatztagebuchEintrag
export const archiveEinsatztagebuchEintrag = {
  mutationKey: ({ missionId }: { missionId: unknown }) => [queryKey, missionId, 'archive'],
  mutationFn:
    ({ missionId }: { missionId: string | null }) =>
    async ({ entryId }: { entryId: string }) => {
      if (!missionId) {
        throw new Error('No missionId found in local storage. Please login and select a mission before fetching einsatztagebuch.');
      }

      return api.journalControllerArchiveJournalEntryV1({
        missionId,
        id: entryId,
      });
    },
};
