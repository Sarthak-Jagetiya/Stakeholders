import { Helmet } from 'react-helmet-async';

import { TransactionView } from 'src/sections/transaction/view';

// ----------------------------------------------------------------------

export default function ProductsPage() {
  return (
    <>
      <Helmet>
        <title> Transaction Form </title>
      </Helmet>

      <TransactionView />
    </>
  );
}
