import { queryClient } from '../routes/__root.js';

/**
 * Checks if all the parameters are present.
 *
 * @param {...any} elements - The parameters to check.
 * @throws {Error} Throws an error if any parameter is missing.
 * @return {undefined}
 */
export function requireParams(...elements: any) {
  if (Array.isArray(elements)) {
    elements.forEach((el) => {
      if (!el) {
        throw new Error('Required parameter missing');
      }
    });
  }
}

/**
 * Creates a function that can be used to invalidate queries in the `queryClient`.
 *
 * @param {unknown[]} queryKey - The key or keys of the queries to invalidate.
 *
 * @return {Function} - A function that, when called, triggers the invalidation of the specified queries.
 */
export function createInvalidateQueries(queryKey: unknown[]): () => Promise<void> {
  return async () => await queryClient.invalidateQueries({
    queryKey,
  });
}