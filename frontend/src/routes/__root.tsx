import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '../style/__root.css';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import { Theme } from '../components/atomic/atoms/Theme.component.js';
import { de } from 'date-fns/locale';
import { setDefaultOptions } from 'date-fns';
import '@fontsource-variable/montserrat';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchIntervalInBackground: false,
      refetchInterval: 5000,
    },
  },
});

const ReactQueryDevtoolsProduction = React.lazy(() =>
  import('@tanstack/react-query-devtools/production').then((d) => ({
    default: d.ReactQueryDevtools,
  })),
);

export const Route = createRootRoute({
  component: () => {
    const [showDevtools, setShowDevtools] = React.useState(false);
    React.useEffect(() => {
      // @ts-expect-error
      window.toggleDevtools = () => setShowDevtools((old) => !old);
      setDefaultOptions({ locale: de });
    }, []);

    return (
      <QueryClientProvider client={queryClient}>
        <Theme />
        <Outlet />
        <TanStackRouterDevtools />
        <ReactQueryDevtools initialIsOpen />
        {showDevtools && (
          <React.Suspense fallback={null}>
            <ReactQueryDevtoolsProduction />
          </React.Suspense>
        )}
      </QueryClientProvider>
    );
  },
});
