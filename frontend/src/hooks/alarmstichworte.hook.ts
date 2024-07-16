import { useQuery } from '@tanstack/react-query';
import { backendFetch } from '../utils/http.js';
import { Alarmstichwort } from '../types/types.js';

export function useAlarmstichworte() {
  const alarmstichworte = useQuery<Alarmstichwort[]>({
    queryKey: ['alarmstichwort'],
    queryFn: () => backendFetch('/alarmstichwort'),
  });

  return { alarmstichworte };
}