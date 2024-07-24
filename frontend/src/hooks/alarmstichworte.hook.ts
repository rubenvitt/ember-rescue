import { useQuery } from '@tanstack/react-query';
import { Alarmstichwort } from '../types/types.js';
import { services } from '../services/backend/index.js';

export function useAlarmstichworte() {
  const alarmstichworte = useQuery<Alarmstichwort[]>({
    queryKey: services.alarmstichworte.fetchAllAlarmstichworte.queryKey,
    queryFn: services.alarmstichworte.fetchAllAlarmstichworte.queryFn,
  });

  return { alarmstichworte };
}