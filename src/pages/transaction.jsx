import { Helmet } from 'react-helmet-async';

import { TransactionView } from 'src/sections/transaction/view';

// ----------------------------------------------------------------------

export default function ProductsPage() {
  return (
    <>
      <Helmet>
        <title> Transaction Form | LG College </title>
      </Helmet>

      <TransactionView />
    </>
  );
}
