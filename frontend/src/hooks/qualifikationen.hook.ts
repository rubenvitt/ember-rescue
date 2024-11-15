import { useQuery } from '@tanstack/react-query';
import { services } from '../services/index.js';
import { QualifikationDto } from '@ember-rescue/shared';

export const useQualifikationen = () => {
  const qualifikationen = useQuery<QualifikationDto[]>({
    queryKey: services.backend.qualifikationen.fetchAllQualifikationen.queryKey,
    queryFn: services.backend.qualifikationen.fetchAllQualifikationen.queryFn,
  });

  return { qualifikationen };
};
