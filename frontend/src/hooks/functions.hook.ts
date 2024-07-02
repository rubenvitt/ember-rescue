import { DependencyList, useEffect, useRef, useState } from 'react';

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