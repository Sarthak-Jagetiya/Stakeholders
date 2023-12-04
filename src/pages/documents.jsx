import { Helmet } from 'react-helmet-async';

import { DocumentsView } from 'src/sections/documents/view';

// ----------------------------------------------------------------------

export default function DocumentsPage() {
  return (
    <>
      <Helmet>
        <title> Documents </title>
      </Helmet>

      <DocumentsView />
    </>
  );
}
