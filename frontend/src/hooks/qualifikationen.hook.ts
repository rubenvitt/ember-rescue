import { useQuery } from '@tanstack/react-query';
import { services } from '../services/index.js';
import { ManyQualificationsResponse } from '@ember-rescue/shared/client/index.js';

export const useQualifikationen = () => {
  const qualifikationen = useQuery<ManyQualificationsResponse>({
    queryKey: services.backend.qualifikationen.fetchAllQualifikationen.queryKey,
    queryFn: services.backend.qualifikationen.fetchAllQualifikationen.queryFn,
  });

  return { qualifikationen };
};
