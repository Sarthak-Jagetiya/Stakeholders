/* eslint-disable perfectionist/sort-imports */
import 'src/global.css';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import { SnackbarProvider  } from 'notistack';
import Router from 'src/routes/sections';
import ThemeProvider from 'src/theme';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <ThemeProvider>
      <SnackbarProvider maxSnack={3}>
        <Router />
      </SnackbarProvider>
    </ThemeProvider>
  );
}
