import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useStore } from './store.hook.js';
import { services } from '../services/index.js';
import { CreateJournalEntryDto, JournalEntryResponse, JournalResponse } from '@bluelight-hub/shared/client/index.js';

export function useEinsatztagebuch() {
  const { missionId } = useStore();
  const queryClient = useQueryClient();
  const { data } = useQuery<JournalResponse>({
    queryKey: services.backend.einsatztagebuch.fetchAllEinsatztagebuchEintraege.queryKey({ missionId: missionId }),
    queryFn: services.backend.einsatztagebuch.fetchAllEinsatztagebuchEintraege.queryFn({ missionId: missionId }),
  });

  const createEinsatztagebuchEintrag = useMutation<JournalEntryResponse, unknown, CreateJournalEntryDto>({
    mutationKey: services.backend.einsatztagebuch.createEinsatztagebuchEintrag.mutationKey({ missionId: missionId }),
    mutationFn: services.backend.einsatztagebuch.createEinsatztagebuchEintrag.mutationFn({ missionId: missionId }),
    onSuccess: services.backend.einsatztagebuch.invalidateQueries(queryClient),
  });

  const archiveEinsatztagebuchEintrag = useMutation<unknown, unknown, { entryId: string }>({
    mutationKey: services.backend.einsatztagebuch.archiveEinsatztagebuchEintrag.mutationKey({ missionId: missionId }),
    mutationFn: services.backend.einsatztagebuch.archiveEinsatztagebuchEintrag.mutationFn({ missionId: missionId }),
    onSuccess: services.backend.einsatztagebuch.invalidateQueries(queryClient),
  });

  return {
    einsatztagebuch: data,
    createEinsatztagebuchEintrag,
    archiveEinsatztagebuchEintrag,
  };
}
