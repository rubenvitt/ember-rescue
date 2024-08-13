import { backendFetchJson } from '../../utils/http.js';
import { createInvalidateQueries, requireParams } from '../../utils/queries.js';
import { QueryClient } from '@tanstack/react-query';
import { CreateNotizDto, NotizDto, UpdateNotizDto } from '../../types/app/notes.types.js';

export const queryKey = 'notizen';

export const invalidateQueries = (queryClient: QueryClient) => createInvalidateQueries([queryKey], queryClient);

/// fetch

export const fetchNotizenForEinsatz = {
  queryKey: ({ einsatzId }: { einsatzId: unknown }) => [queryKey, einsatzId],
  queryFn: ({ einsatzId }: { einsatzId: string | null }) => function() {
    requireParams(einsatzId);
    return backendFetchJson<NotizDto[]>(`/notizen`);
  },
};

// mutate

export const postAddNotizToEinsatz = {
  mutationKey: ({ einsatzId }: { einsatzId: unknown }) => [queryKey, einsatzId, 'add'],
  mutationFn: ({ einsatzId }: { einsatzId: string | null }) => async (notiz: CreateNotizDto) => {
    console.log('Add notiz to einsatz', { notiz, einsatzId });
    return await backendFetchJson<NotizDto>(`/notizen`, {
      body: JSON.stringify(notiz),
      method: 'POST',
    });
  },
};

export const updateNotiz = {
  mutationKey: ({ einsatzId, notizId }: {
    einsatzId: unknown,
    notizId: unknown
  }) => [queryKey, einsatzId, notizId, 'update'],
  mutationFn: ({ einsatzId, notizId }: {
    einsatzId: string | null,
    notizId: string | undefined,
  }) => async (notiz: UpdateNotizDto) => {
    console.log('Update notiz in einsatz', { notiz, einsatzId });
    requireParams(einsatzId);
    return await backendFetchJson<NotizDto>(`/notizen/${notizId}`, {
      body: JSON.stringify(notiz),
      method: 'PUT',
    });
  },
};

export const deleteNotizFromEinsatz = {
  mutationKey: ({ einsatzId }: {
    einsatzId: unknown,
  }) => [queryKey, einsatzId, 'remove'],
  mutationFn: ({ notizId, einsatzId }: { notizId?: string, einsatzId: string | null }) => async function() {
    requireParams(notizId, einsatzId);
    return await backendFetchJson(`/notizen/${notizId}`, {
      method: 'DELETE',
    });
  },
};