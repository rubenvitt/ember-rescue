import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { services } from '../services/index.js';
import { CreateNotizDto, NotizDto, UpdateNotizDto } from '../types/app/notes.types.js';
import { useEinsatz } from './einsatz.hook.js';

type Props = {
  notizId?: string;
};

export function useNotizen(props?: Props) {
  const queryClient = useQueryClient();
  const { einsatzId } = useEinsatz();

  const activeNotizen = useQuery<NotizDto[]>({
    queryKey: services.backend.notizen.fetchNotizenUndoneForEinsatz.queryKey({ einsatzId }),
    queryFn: services.backend.notizen.fetchNotizenUndoneForEinsatz.queryFn({ einsatzId }),
  });

  const archivedNotizen = useQuery<NotizDto[]>({
    queryKey: services.backend.notizen.fetchNotizenDoneForEinsatz.queryKey({ einsatzId }),
    queryFn: services.backend.notizen.fetchNotizenDoneForEinsatz.queryFn({ einsatzId }),
  });

  const createNotiz = useMutation<NotizDto, unknown, CreateNotizDto>({
    mutationKey: services.backend.notizen.postAddNotizToEinsatz.mutationKey({ einsatzId }),
    mutationFn: services.backend.notizen.postAddNotizToEinsatz.mutationFn({ einsatzId }),
    onSuccess: services.backend.notizen.invalidateQueries(queryClient),
  });

  const deleteNotiz = useMutation<NotizDto, unknown, void>({
    mutationKey: services.backend.notizen.deleteNotizFromEinsatz.mutationKey({ einsatzId, notizId: props?.notizId }),
    mutationFn: services.backend.notizen.deleteNotizFromEinsatz.mutationFn({ einsatzId, notizId: props?.notizId }),
    onSuccess: services.backend.notizen.invalidateQueries(queryClient),
  });

  const toggleCompleteNotiz = useMutation<unknown, unknown, void>({
    mutationKey: services.backend.notizen.toggleCompleteNotizInEinsatz.mutationKey({
      einsatzId,
      notizId: props?.notizId,
    }),
    mutationFn: services.backend.notizen.toggleCompleteNotizInEinsatz.mutationFn({
      einsatzId,
      notizId: props?.notizId,
    }),
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
    activeNotizen,
    archivedNotizen,
    toggleCompleteNotiz,
    deleteNotiz,
  };
}
