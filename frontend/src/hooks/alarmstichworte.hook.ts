import { useQuery } from '@tanstack/react-query';
import { services } from '../services/index.js';
import { ManyEinsatzAlarmstichwortDto } from '@ember-rescue/shared/client/index.js';

export function useAlarmstichworte() {
  const alarmstichworte = useQuery<ManyEinsatzAlarmstichwortDto>({
    queryKey: services.backend.alarmstichworte.fetchAllAlarmstichworte.queryKey,
    queryFn: services.backend.alarmstichworte.fetchAllAlarmstichworte.queryFn,
  });

  return { alarmstichworte };
}
