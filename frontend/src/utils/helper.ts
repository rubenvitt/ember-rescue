export function arrayPresentAndNotEmpty(array: unknown[] | undefined | null) {
  return array && array.length > 0;
}

export function fetchedAndDataInArray<T>({ isFetched, data }: {
  isFetched: boolean;
  data: T[] | undefined
}, array?: unknown[]) {
  return isFetched && arrayPresentAndNotEmpty(data) && arrayPresentAndNotEmpty(array);
}