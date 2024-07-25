import { useQuery } from '@tanstack/react-query';
import { Alarmstichwort } from '../types/types.js';
import { services } from '../services/index.js';

export function useAlarmstichworte() {
  const alarmstichworte = useQuery<Alarmstichwort[]>({
    queryKey: services.backend.alarmstichworte.fetchAllAlarmstichworte.queryKey,
    queryFn: services.backend.alarmstichworte.fetchAllAlarmstichworte.queryFn,
  });

  return { alarmstichworte };
}