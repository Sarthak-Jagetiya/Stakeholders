import { Helmet } from 'react-helmet-async';

import { LogsTable } from 'src/sections/logs/view';

// ----------------------------------------------------------------------

export default function LogsPage() {
  return (
    <>
      <Helmet>
        <title> Logs | LG College </title>
      </Helmet>

      <LogsTable />
    </>
  );
}
