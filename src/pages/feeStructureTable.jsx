import { Helmet } from 'react-helmet-async';

import { FeeStructureTable } from 'src/sections/feestructuretable/view';

// ----------------------------------------------------------------------

export default function FeeStructureTablePage() {
  return (
    <>
      <Helmet>
        <title> Fee Structure Table | LG College </title>
      </Helmet>

      <FeeStructureTable />
    </>
  );
}
