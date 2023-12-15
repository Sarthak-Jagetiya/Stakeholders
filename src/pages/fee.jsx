import { Helmet } from 'react-helmet-async';

import { FeeView } from 'src/sections/fee/view';

// ----------------------------------------------------------------------

export default function FeePage() {
  return (
    <>
      <Helmet>
        <title> Fee Analysis | LG College </title>
      </Helmet>

      <FeeView />
    </>
  );
}
