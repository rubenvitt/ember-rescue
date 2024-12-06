import { getAPIConfig } from '../../utils/http.js';
import { createInvalidateQueries } from '../../utils/queries.js';
import { QueryClient } from '@tanstack/react-query';
import { CreateNotizDto, UpdateNotizDto } from '../../types/app/notes.types.js';
import { NotizenApi } from '@ember-rescue/shared/client/index.js';

export const queryKey = 'notizen';

export const invalidateQueries = (queryClient: QueryClient) => createInvalidateQueries([queryKey], queryClient);

const api = new NotizenApi(getAPIConfig());

/// fetch

export const fetchNotizenUndoneForEinsatz = {
  queryKey: ({ einsatzId }: { einsatzId: unknown }) => [queryKey, einsatzId, 'archived=false'],
  queryFn: ({ einsatzId }: { einsatzId: string | null }) =>
    function () {
      if (!einsatzId) throw new Error('NotizId or einsatzId not given. Please provide both.');

      return api.notizenControllerGetNotizenV1({
        done: false,
        missionId: einsatzId,
      });
    },
};

export const fetchNotizenDoneForEinsatz = {
  queryKey: ({ einsatzId }: { einsatzId: unknown }) => [queryKey, einsatzId, 'archived=true'],
  queryFn: ({ einsatzId }: { einsatzId: string | null }) =>
    function () {
      if (!einsatzId) throw new Error('NotizId or einsatzId not given. Please provide both.');

      return api.notizenControllerGetNotizenV1({
        done: true,
        missionId: einsatzId,
      });
    },
};

// mutate

export const postAddNotizToEinsatz = {
  mutationKey: ({ einsatzId }: { einsatzId: unknown }) => [queryKey, einsatzId, 'add'],
  mutationFn:
    ({ einsatzId }: { einsatzId: string | null }) =>
    async (notiz: CreateNotizDto) => {
      console.log('Add notiz to einsatz', { notiz, einsatzId });

      if (!einsatzId) throw new Error('NotizId or einsatzId not given. Please provide both.');

      return api.notizenControllerCreateNotizV1({
        missionId: einsatzId,
        createNotizDto: notiz,
      });
    },
};

export const updateNotiz = {
  mutationKey: ({ einsatzId, notizId }: { einsatzId: unknown; notizId: unknown }) => [queryKey, einsatzId, notizId, 'update'],
  mutationFn:
    ({ einsatzId, notizId }: { einsatzId: string | null; notizId: string | undefined }) =>
    async (notiz: UpdateNotizDto) => {
      console.log('Update notiz in einsatz', { notiz, einsatzId });
      if (!einsatzId || !notizId) throw new Error('NotizId or einsatzId not given. Please provide both.');

      return api.notizenControllerUpdateNotizV1({
        notizId,
        missionId: einsatzId,
        createNotizDto: notiz,
      });
    },
};

export const deleteNotizFromEinsatz = {
  mutationKey: ({ einsatzId, notizId }: { einsatzId: unknown; notizId: unknown }) => [queryKey, einsatzId, notizId, 'remove'],
  mutationFn: ({ notizId, einsatzId }: { notizId?: string; einsatzId: string | null }) =>
    async function () {
      if (!notizId || !einsatzId) throw new Error('NotizId or einsatzId not given. Please provide both.');
      console.log('Remove notiz from einsatz', notizId, einsatzId);

      return api.notizenControllerDeleteNotizV1({
        notizId,
        missionId: einsatzId,
      });
    },
};

export const toggleCompleteNotizInEinsatz = {
  mutationKey: ({ einsatzId, notizId }: { einsatzId: unknown; notizId: unknown }) => [queryKey, einsatzId, notizId, 'complete'],
  mutationFn: ({ notizId, einsatzId }: { notizId?: string; einsatzId: string | null }) =>
    async function () {
      if (!notizId || !einsatzId) throw new Error('NotizId or einsatzId not given. Please provide both.');
      console.log('Toggle complete notiz in einsatz', notizId, einsatzId);

      return api.notizenControllerCompleteNotizV1({
        notizId,
        missionId: einsatzId,
      });
    },
};
