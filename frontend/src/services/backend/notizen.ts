import { getAPIConfig } from '../../utils/http.js';
import { createInvalidateQueries } from '../../utils/queries.js';
import { QueryClient } from '@tanstack/react-query';
import { CreateNotizDto, NotizenApi } from '@ember-rescue/shared/client/index.js';

export const queryKey = 'notizen';

export const invalidateQueries = (queryClient: QueryClient) => createInvalidateQueries([queryKey], queryClient);

const api = new NotizenApi(getAPIConfig());

/// fetch

export const fetchNotizenUndoneForEinsatz = {
  queryKey: ({ missionId }: { missionId: unknown }) => [queryKey, missionId, 'archived=false'],
  queryFn: ({ missionId }: { missionId: string | null }) =>
    function () {
      if (!missionId) throw new Error('NotizId or missionId not given. Please provide both.');

      return api.notizenControllerGetNotizenV1({
        done: false,
        missionId: missionId,
      });
    },
};

export const fetchNotizenDoneForEinsatz = {
  queryKey: ({ missionId }: { missionId: unknown }) => [queryKey, missionId, 'archived=true'],
  queryFn: ({ missionId }: { missionId: string | null }) =>
    function () {
      if (!missionId) throw new Error('NotizId or missionId not given. Please provide both.');

      return api.notizenControllerGetNotizenV1({
        done: true,
        missionId: missionId,
      });
    },
};

// mutate

export const postAddNotizToEinsatz = {
  mutationKey: ({ missionId }: { missionId: unknown }) => [queryKey, missionId, 'add'],
  mutationFn:
    ({ missionId }: { missionId: string | null }) =>
    async (notiz: CreateNotizDto) => {
      console.log('Add notiz to einsatz', { notiz, missionId });

      if (!missionId) throw new Error('NotizId or missionId not given. Please provide both.');

      return api.notizenControllerCreateNotizV1({
        missionId: missionId,
        createNotizDto: notiz,
      });
    },
};

export const updateNotiz = {
  mutationKey: ({ missionId, notizId }: { missionId: unknown; notizId: unknown }) => [queryKey, missionId, notizId, 'update'],
  mutationFn:
    ({ missionId, notizId }: { missionId: string | null; notizId: string | undefined }) =>
    async (notiz: CreateNotizDto) => {
      console.log('Update notiz in einsatz', { notiz, missionId });
      if (!missionId || !notizId) throw new Error('NotizId or missionId not given. Please provide both.');

      return api.notizenControllerUpdateNotizV1({
        notizId,
        missionId: missionId,
        createNotizDto: notiz,
      });
    },
};

export const deleteNotizFromEinsatz = {
  mutationKey: ({ missionId, notizId }: { missionId: unknown; notizId: unknown }) => [queryKey, missionId, notizId, 'remove'],
  mutationFn: ({ notizId, missionId }: { notizId?: string; missionId: string | null }) =>
    async function () {
      if (!notizId || !missionId) throw new Error('NotizId or missionId not given. Please provide both.');
      console.log('Remove notiz from einsatz', notizId, missionId);

      return api.notizenControllerDeleteNotizV1({
        notizId,
        missionId: missionId,
      });
    },
};

export const toggleCompleteNotizInEinsatz = {
  mutationKey: ({ missionId, notizId }: { missionId: unknown; notizId: unknown }) => [queryKey, missionId, notizId, 'complete'],
  mutationFn: ({ notizId, missionId }: { notizId?: string; missionId: string | null }) =>
    async function () {
      if (!notizId || !missionId) throw new Error('NotizId or missionId not given. Please provide both.');
      console.log('Toggle complete notiz in einsatz', notizId, missionId);

      return api.notizenControllerCompleteNotizV1({
        notizId,
        missionId: missionId,
      });
    },
};
