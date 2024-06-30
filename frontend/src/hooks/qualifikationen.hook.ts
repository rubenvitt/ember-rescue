import { useQuery } from '@tanstack/react-query';
import { QualifikationDto } from '../types.js';
import { backendFetch } from '../lib/http.js';

export const useQualifikationen = () => {
  let { data: qualifikationen, isLoading, isFetched } = useQuery<QualifikationDto[]>({
    queryKey: ['qualifikationen'],
    queryFn: async () => backendFetch('/qualifikationen'),
  });

  return { qualifikationen: { data: qualifikationen, isLoading, isFetched } };
};
