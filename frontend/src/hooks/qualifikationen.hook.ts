import { useQuery } from '@tanstack/react-query';
import { QualifikationDto } from '../types/types.js';
import { services } from '../services/backend/index.js';

export const useQualifikationen = () => {
  const qualifikationen = useQuery<QualifikationDto[]>({
    queryKey: services.qualifikationen.fetchAllQualifikationen.queryKey,
    queryFn: services.qualifikationen.fetchAllQualifikationen.queryFn,
  });

  return { qualifikationen };
};
