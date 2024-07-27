import { useMutation, useQuery } from '@tanstack/react-query';
import { useStore } from './store.hook.js';
import { services } from '../services/index.js';
import { CreateEinsatztagebuchEintrag, EinsatztagebuchEintrag } from '../types/app/einsatztagebuch.types.js';

export function useEinsatztagebuch() {
  const { einsatzId } = useStore();
  const { data } = useQuery<EinsatztagebuchEintrag[]>({
    queryKey: services.backend.einsatztagebuch.fetchAllEinsatztagebuchEintraege.queryKey({ einsatzId }),
    queryFn: services.backend.einsatztagebuch.fetchAllEinsatztagebuchEintraege.queryFn,
  });

  const createEinsatztagebuchEintrag = useMutation<EinsatztagebuchEintrag, unknown, CreateEinsatztagebuchEintrag>({
    mutationKey: services.backend.einsatztagebuch.createEinsatztagebuchEintrag.mutationKey({ einsatzId }),
    mutationFn: services.backend.einsatztagebuch.createEinsatztagebuchEintrag.mutationFn,
    onSuccess: services.backend.einsatztagebuch.invalidateQueries,
  });

  const archiveEinsatztagebuchEintrag = useMutation<unknown, unknown, { einsatztagebuchEintragId: string }>({
    mutationKey: services.backend.einsatztagebuch.archiveEinsatztagebuchEintrag.mutationKey({ einsatzId }),
    mutationFn: services.backend.einsatztagebuch.archiveEinsatztagebuchEintrag.mutationFn,
    onSuccess: services.backend.einsatztagebuch.invalidateQueries,
  });

  return {
    einsatztagebuch: data,
    createEinsatztagebuchEintrag,
    archiveEinsatztagebuchEintrag,
  };
}