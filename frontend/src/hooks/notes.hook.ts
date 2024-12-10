import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { services } from '../services/index.js';
import { useEinsatz } from './einsatz.hook.js';
import { CreateNotizDto, ManyNoteResponse, OneNoteResponse } from '@bluelight-hub/shared/client/index.js';

type Props = {
  notizId?: string;
};

export function useNotizen(props?: Props) {
  const queryClient = useQueryClient();
  const { missionId } = useEinsatz();

  const activeNotizen = useQuery<ManyNoteResponse>({
    queryKey: services.backend.notizen.fetchNotizenUndoneForEinsatz.queryKey({ missionId }),
    queryFn: services.backend.notizen.fetchNotizenUndoneForEinsatz.queryFn({ missionId }),
  });

  const archivedNotizen = useQuery<ManyNoteResponse>({
    queryKey: services.backend.notizen.fetchNotizenDoneForEinsatz.queryKey({ missionId }),
    queryFn: services.backend.notizen.fetchNotizenDoneForEinsatz.queryFn({ missionId }),
  });

  const createNotiz = useMutation<OneNoteResponse, unknown, CreateNotizDto>({
    mutationKey: services.backend.notizen.postAddNotizToEinsatz.mutationKey({ missionId }),
    mutationFn: services.backend.notizen.postAddNotizToEinsatz.mutationFn({ missionId }),
    onSuccess: () => {
      console.log('notiz created, invalidating queries');
      services.backend.notizen.invalidateQueries(queryClient);
    },
  });

  const deleteNotiz = useMutation<void, unknown, void>({
    mutationKey: services.backend.notizen.deleteNotizFromEinsatz.mutationKey({ missionId, notizId: props?.notizId }),
    mutationFn: services.backend.notizen.deleteNotizFromEinsatz.mutationFn({ missionId, notizId: props?.notizId }),
    onSuccess: services.backend.notizen.invalidateQueries(queryClient),
  });

  const toggleCompleteNotiz = useMutation<unknown, unknown, void>({
    mutationKey: services.backend.notizen.toggleCompleteNotizInEinsatz.mutationKey({
      missionId,
      notizId: props?.notizId,
    }),
    mutationFn: services.backend.notizen.toggleCompleteNotizInEinsatz.mutationFn({
      missionId,
      notizId: props?.notizId,
    }),
    onSuccess: services.backend.notizen.invalidateQueries(queryClient),
    onError: services.backend.notizen.invalidateQueries(queryClient),
  });

  const changeNotiz = useMutation<void, unknown, CreateNotizDto>({
    mutationKey: services.backend.notizen.updateNotiz.mutationKey({ missionId, notizId: props?.notizId }),
    mutationFn: services.backend.notizen.updateNotiz.mutationFn({ missionId, notizId: props?.notizId }),
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
