import { useQuery } from '@tanstack/react-query';

export function useBearbeiter() {
  let { data } = useQuery({
    queryKey: ['bearbeiter'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3000/bearbeiter', {
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
      });
      return await response.json();
    },
  });
  return data;
}