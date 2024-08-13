import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { services } from '../services/index.js';
import { CreateNotizDto, NotizDto, UpdateNotizDto } from '../types/app/notes.types.js';
import { useEinsatz } from './einsatz.hook.js';

type Props = {
  notizId?: string;
}

export function useNotizen(props?: Props) {
  const queryClient = useQueryClient();
  const { einsatzId } = useEinsatz();

  const alleNotizen = useQuery<NotizDto[]>({
    queryKey: services.backend.notizen.fetchNotizenForEinsatz.queryKey({ einsatzId }),
    queryFn: services.backend.notizen.fetchNotizenForEinsatz.queryFn({ einsatzId }),
  });

  const createNotiz = useMutation<NotizDto, unknown, CreateNotizDto>({
    mutationKey: services.backend.notizen.postAddNotizToEinsatz.mutationKey({ einsatzId }),
    mutationFn: services.backend.notizen.postAddNotizToEinsatz.mutationFn({ einsatzId }),
    onSuccess: services.backend.notizen.invalidateQueries(queryClient),
  });

  const deleteNotiz = useMutation<unknown, unknown, NotizDto>({
    mutationKey: services.backend.notizen.deleteNotizFromEinsatz.mutationKey({ einsatzId }),
    mutationFn: services.backend.notizen.deleteNotizFromEinsatz.mutationFn({ einsatzId }),
    onSuccess: services.backend.notizen.invalidateQueries(queryClient),
  });

  const changeNotiz = useMutation<NotizDto, unknown, UpdateNotizDto>({
    mutationKey: services.backend.notizen.updateNotiz.mutationKey({ einsatzId, notizId: props?.notizId }),
    mutationFn: services.backend.notizen.updateNotiz.mutationFn({ einsatzId, notizId: props?.notizId }),
    onSuccess: services.backend.notizen.invalidateQueries(queryClient),
  });

  return {
    createNotiz,
    changeNotiz,
    alleNotizen,
    deleteNotiz,
  };
}