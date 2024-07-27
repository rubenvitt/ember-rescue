import { useQuery } from '@tanstack/react-query';
import { services } from '../services/index.js';
import { QualifikationTypes } from '../types/app/qualifikation.types.js';

export const useQualifikationen = () => {
  const qualifikationen = useQuery<QualifikationTypes[]>({
    queryKey: services.backend.qualifikationen.fetchAllQualifikationen.queryKey,
    queryFn: services.backend.qualifikationen.fetchAllQualifikationen.queryFn,
  });

  return { qualifikationen };
};
