import { createRootRoute, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '../styles/__root.css';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React, { Suspense, useEffect } from 'react';
import { ThemeProvider } from '../components/atomic/atoms/Theme.component.js';
import { de } from 'date-fns/locale';
import { setDefaultOptions } from 'date-fns';
import '@fontsource-variable/montserrat';
import '@fontsource-variable/inter';
import '@fontsource-variable/nunito';
import { Modal } from '../components/atomic/organisms/modal/Modal.component.js';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchIntervalInBackground: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchInterval: 5000,
    },
  },
});

const ReactQueryDevtoolsProduction = React.lazy(() =>
  import('@tanstack/react-query-devtools/production').then((d) => ({
    default: d.ReactQueryDevtools,
  })),
);

const TanStackRouterDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null // Render nothing in production
    : React.lazy(() =>
      // Lazy load in development
      import('@tanstack/router-devtools').then((res) => ({
        default: res.TanStackRouterDevtools,
        // For Embedded Mode
        // default: res.TanStackRouterDevtoolsPanel
      })),
    );

export const Route = createRootRoute({
  component: () => {
    const [showDevtools, setShowDevtools] = React.useState(false);
    useEffect(() => {
      // @ts-expect-error
      window.toggleDevtools = () => setShowDevtools((old) => !old);
      setDefaultOptions({ locale: de });
    }, []);

    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Outlet />
          <Modal />
          <ReactQueryDevtools initialIsOpen />
          <Suspense>
            <TanStackRouterDevtools />
          </Suspense>
          {showDevtools && (
            <React.Suspense fallback={null}>
              <ReactQueryDevtoolsProduction />
            </React.Suspense>
          )}
        </ThemeProvider>
      </QueryClientProvider>
    );
  },
});
