import { Helmet } from 'react-helmet-async';

import { FeeStructureView } from 'src/sections/feestructure/view';

// ----------------------------------------------------------------------

export default function ProductsPage() {
  return (
    <>
      <Helmet>
        <title> Fee Structure | LG College </title>
      </Helmet>

      <FeeStructureView />
    </>
  );
}
