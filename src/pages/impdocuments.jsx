import { Helmet } from 'react-helmet-async';

import { ImpDocumentsView } from 'src/sections/impdocuments/view';

// ----------------------------------------------------------------------

export default function ImpDocumentsPage() {
  return (
    <>
      <Helmet>
        <title> ImpDocuments-Table | LG College </title>
      </Helmet>

      <ImpDocumentsView />
    </>
  );
}
