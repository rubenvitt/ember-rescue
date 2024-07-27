import { useMutation, useQuery } from '@tanstack/react-query';
import { useEinsatz } from '../einsatz.hook.js';
import { useMemo } from 'react';
import { PatchEinheitenType } from '../../services/backend/einheiten.js';
import { services } from '../../services/index.js';
import { EinheitDto, EinheitTypDto } from '../../types/app/einheit.types.js';

export function useEinheiten(props?: { einheitId?: string }) {
  const { einsatzId } = useEinsatz();
  const einheiten = useQuery<EinheitDto[]>({
    queryKey: services.backend.einheiten.fetchAllEinheiten.queryKey,
    queryFn: services.backend.einheiten.fetchAllEinheiten.queryFn,
  });
  const einheitenImEinsatz = useQuery<EinheitDto[]>({
    queryKey: services.backend.einheiten.fetchAllEinheitenImEinsatz.queryKey({ einsatzId }),
    queryFn: services.backend.einheiten.fetchAllEinheitenImEinsatz.queryFn({ einsatzId }),
    enabled: Boolean(einsatzId),
  });

  const einheitenNichtImEinsatz = useMemo(() => {
    if (!einheiten.data || !einheitenImEinsatz.data) {
      return [];
    }
    const einsatzEinheitenIds = new Set(einheitenImEinsatz.data.map(einheit => einheit.id));
    return einheiten.data.filter(einheit => !einsatzEinheitenIds.has(einheit.id));
  }, [einheiten, einheitenImEinsatz]);

  const einheitenTypen = useQuery<EinheitTypDto[]>({
    queryKey: services.backend.einheiten.fetchEinheitenTypen.queryKey,
    queryFn: services.backend.einheiten.fetchEinheitenTypen.queryFn,
  });

  const patchEinheiten = useMutation<unknown, unknown, PatchEinheitenType>({
    mutationKey: services.backend.einheiten.patchEinheiten.mutationKey,
    mutationFn: services.backend.einheiten.patchEinheiten.mutationFn,
    onSuccess: services.backend.einheiten.invalidateQueries,
  });

  const addEinheitToEinsatz = useMutation<unknown, unknown, { einheitId: string }>({
    mutationKey: services.backend.einheiten.postAddEinheitToEinsatz.mutationKey({ einsatzId }),
    mutationFn: services.backend.einheiten.postAddEinheitToEinsatz.mutationFn({ einsatzId }),
    onSuccess: services.backend.einheiten.invalidateQueries,
  });

  const removeEinheitFromEinsatz = useMutation<unknown, unknown, {}>({
    mutationKey: services.backend.einheiten.deleteEinheitFromEinsatz.mutationKey({
      einsatzId,
      einheitId: props?.einheitId,
    }),
    mutationFn: services.backend.einheiten.deleteEinheitFromEinsatz.mutationFn({
      einheitId: props?.einheitId,
      einsatzId,
    }),
    onSuccess: services.backend.einheiten.invalidateQueries,
  });

  const changeStatus = useMutation<unknown, unknown, { statusId: string }>({
    mutationKey: services.backend.einheiten.postStatusForEinheit.mutationKey({
      einsatzId,
      einheitId: props?.einheitId,
    }),
    mutationFn: services.backend.einheiten.postStatusForEinheit.mutationFn({ einsatzId, einheitId: props?.einheitId }),
    onSuccess: services.backend.einheiten.invalidateQueries,
  });


  return {
    einheiten,
    einheitenImEinsatz,
    einheitenTypen,
    patchEinheiten,
    addEinheitToEinsatz,
    removeEinheitFromEinsatz,
    einheitenNichtImEinsatz,
    changeStatus,
  };
}