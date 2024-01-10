import { Helmet } from 'react-helmet-async';

import { ScholarshipTableView } from 'src/sections/scholarshiptable/view';

// ----------------------------------------------------------------------

export default function TransactionsPage() {
  return (
    <>
      <Helmet>
        <title> Scholarship Table | LG College </title>
      </Helmet>

      <ScholarshipTableView />
    </>
  );
}
