export function useEinsatz() {
  const einsatz = {
    isLoading: false,
    isFetched: true,
    data: null,
  };
  
  return { einsatz };
}