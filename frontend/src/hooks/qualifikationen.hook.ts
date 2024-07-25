import { useQuery } from '@tanstack/react-query';
import { QualifikationDto } from '../types/types.js';
import { services } from '../services/index.js';

export const useQualifikationen = () => {
  const qualifikationen = useQuery<QualifikationDto[]>({
    queryKey: services.backend.qualifikationen.fetchAllQualifikationen.queryKey,
    queryFn: services.backend.qualifikationen.fetchAllQualifikationen.queryFn,
  });

  return { qualifikationen };
};
