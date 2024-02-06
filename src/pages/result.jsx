import { Helmet } from 'react-helmet-async';

import { ResultView } from 'src/sections/result/view';

// ----------------------------------------------------------------------

export default function ResultPage() {
  return (
    <>
      <Helmet>
        <title> Result | LG College </title>
      </Helmet>

      <ResultView />
    </>
  );
}
