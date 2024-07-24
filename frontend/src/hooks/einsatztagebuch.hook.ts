import { useMutation, useQuery } from '@tanstack/react-query';
import { CreateEinsatztagebuchEintrag, EinsatztagebuchEintrag } from '../types/types.js';
import { useStore } from './store.hook.js';
import { services } from '../services/backend/index.js';

export function useEinsatztagebuch() {
  const { einsatzId } = useStore();
  const { data } = useQuery<EinsatztagebuchEintrag[]>({
    queryKey: services.einsatztagebuch.fetchAllEinsatztagebuchEintraege.queryKey({ einsatzId }),
    queryFn: services.einsatztagebuch.fetchAllEinsatztagebuchEintraege.queryFn,
  });

  const createEinsatztagebuchEintrag = useMutation<EinsatztagebuchEintrag, unknown, CreateEinsatztagebuchEintrag>({
    mutationKey: services.einsatztagebuch.createEinsatztagebuchEintrag.mutationKey({ einsatzId }),
    mutationFn: services.einsatztagebuch.createEinsatztagebuchEintrag.mutationFn,
    onSuccess: services.einsatztagebuch.invalidateQueries,
  });

  const archiveEinsatztagebuchEintrag = useMutation<unknown, unknown, { einsatztagebuchEintragId: string }>({
    mutationKey: services.einsatztagebuch.archiveEinsatztagebuchEintrag.mutationKey({ einsatzId }),
    mutationFn: services.einsatztagebuch.archiveEinsatztagebuchEintrag.mutationFn,
    onSuccess: services.einsatztagebuch.invalidateQueries,
  });

  return {
    einsatztagebuch: data,
    createEinsatztagebuchEintrag,
    archiveEinsatztagebuchEintrag,
  };
}