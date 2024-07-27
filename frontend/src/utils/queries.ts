import { queryClient } from '../routes/__root.js';

/**
 * Checks if all parameters are present and not null or undefined.
 * Throws an error if any parameter is missing.
 *
 * @param {...unknown} elements - The parameters to be checked.
 * @throws {Error} If any required parameter is missing.
 */
export function requireParams(...elements: unknown[]) {
  elements.forEach((el) => {
    if (!el) {
      throw new Error('Required parameter missing');
    }
  });
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