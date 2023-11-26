import { Helmet } from 'react-helmet-async';

import { DocumentView } from 'src/sections/document/view';

// ----------------------------------------------------------------------

export default function ProductsPage() {
  return (
    <>
      <Helmet>
        <title> Document Form </title>
      </Helmet>

      <DocumentView />
    </>
  );
}
