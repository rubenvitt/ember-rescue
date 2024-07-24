import { useMutation, useQuery } from '@tanstack/react-query';
import { EinheitDto, EinheitTypDto } from '../../types/types.js';
import { useEinsatz } from '../einsatz.hook.js';
import { useMemo } from 'react';
import { services } from '../../services/backend/index.js';
import { PatchEinheitenType } from '../../services/backend/einheiten.js';

export function useEinheiten(props?: { einheitId?: string }) {
  const { einsatzId } = useEinsatz();
  const einheiten = useQuery<EinheitDto[]>({
    queryKey: services.einheiten.fetchAllEinheiten.queryKey,
    queryFn: services.einheiten.fetchAllEinheiten.queryFn,
  });
  const einheitenImEinsatz = useQuery<EinheitDto[]>({
    queryKey: services.einheiten.fetchAllEinheitenImEinsatz.queryKey({ einsatzId }),
    queryFn: services.einheiten.fetchAllEinheitenImEinsatz.queryFn({ einsatzId }),
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
    queryKey: services.einheiten.fetchEinheitenTypen.queryKey,
    queryFn: services.einheiten.fetchEinheitenTypen.queryFn,
  });

  const patchEinheiten = useMutation<unknown, unknown, PatchEinheitenType>({
    mutationKey: services.einheiten.patchEinheiten.mutationKey,
    mutationFn: services.einheiten.patchEinheiten.mutationFn,
    onSuccess: services.einheiten.invalidateQueries,
  });

  const addEinheitToEinsatz = useMutation<unknown, unknown, { einheitId: string }>({
    mutationKey: services.einheiten.postAddEinheitToEinsatz.mutationKey({ einsatzId }),
    mutationFn: services.einheiten.postAddEinheitToEinsatz.mutationFn({ einsatzId }),
    onSuccess: services.einheiten.invalidateQueries,
  });

  const removeEinheitFromEinsatz = useMutation<unknown, unknown, {}>({
    mutationKey: services.einheiten.deleteEinheitFromEinsatz.mutationKey({ einsatzId, einheitId: props?.einheitId }),
    mutationFn: services.einheiten.deleteEinheitFromEinsatz.mutationFn({ einheitId: props?.einheitId, einsatzId }),
    onSuccess: services.einheiten.invalidateQueries,
  });

  const changeStatus = useMutation<unknown, unknown, { statusId: string }>({
    mutationKey: services.einheiten.postStatusForEinheit.mutationKey({
      einsatzId,
      einheitId: props?.einheitId,
    }),
    mutationFn: services.einheiten.postStatusForEinheit.mutationFn({ einsatzId, einheitId: props?.einheitId }),
    onSuccess: services.einheiten.invalidateQueries,
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