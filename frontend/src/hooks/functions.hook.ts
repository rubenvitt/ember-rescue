import { DependencyList, useEffect, useRef, useState } from 'react';

/**
 * Custom hook that allows you to call a specified callback function in a set interval.
 *
 * @param callback - The function to be called in the interval.
 * @param delay - The time interval in milliseconds.
 * @param dependencies - Optional array of dependencies to trigger re-execution of the callback function.
 * @return The value returned by the callback function, or undefined if the callback is not specified.
 */
export function useInterval<T>(callback: () => T, delay: number, dependencies: DependencyList): T | undefined {
  const [value, setValue] = useState<T | undefined>(undefined);
  const savedCallback = useRef<() => T>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        setValue(savedCallback.current());
      }
    }

    tick();

    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [savedCallback, delay, ...dependencies]);

  return value;
}