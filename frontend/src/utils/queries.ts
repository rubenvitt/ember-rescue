import { QueryClient } from '@tanstack/react-query';

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
 * Creates a function that invalidates queries in a QueryClient.
 *
 * @param {unknown[]} queryKey - The key of the queries to invalidate.
 * @param {QueryClient} queryClient - The QueryClient object to invalidate queries in.
 *
 * @return {() => Promise<void>} The function that invalidates the queries.
 */
export function createInvalidateQueries(queryKey: unknown[], queryClient: QueryClient): () => Promise<void> {
  return async () =>
    await queryClient.invalidateQueries({
      queryKey,
    });
}
