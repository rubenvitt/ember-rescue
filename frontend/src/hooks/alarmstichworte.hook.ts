import { useQuery } from '@tanstack/react-query';
import { services } from '../services/index.js';
import { Alarmstichwort } from '../types/app/alarmstichwort.types.js';

export function useAlarmstichworte() {
  const alarmstichworte = useQuery<Alarmstichwort[]>({
    queryKey: services.backend.alarmstichworte.fetchAllAlarmstichworte.queryKey,
    queryFn: services.backend.alarmstichworte.fetchAllAlarmstichworte.queryFn,
  });

  return { alarmstichworte };
}