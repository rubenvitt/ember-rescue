import { useQuery } from '@tanstack/react-query';
import { fetch } from '@tauri-apps/plugin-http';
import { QualifikationDto } from '../types.js';

export const useQualifikationen = () => {
  let { data: qualifikationen, isLoading, isFetched } = useQuery<QualifikationDto[]>({
    queryKey: ['qualifikationen'],
    queryFn: async () => fetch('http://localhost:3000/qualifikationen').then((res) => res.json()),
  });

  return { qualifikationen: { data: qualifikationen, isLoading, isFetched } };
};
