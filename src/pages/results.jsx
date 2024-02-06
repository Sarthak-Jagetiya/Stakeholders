import { Helmet } from 'react-helmet-async';

import { ResultsView } from 'src/sections/results/view';

// ----------------------------------------------------------------------

export default function ResultsPage() {
  return (
    <>
      <Helmet>
        <title> Results-Table | LG College </title>
      </Helmet>

      <ResultsView />
    </>
  );
}
