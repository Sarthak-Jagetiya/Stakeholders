import { Helmet } from 'react-helmet-async';

import { ImpDocumentView } from 'src/sections/impdocument/view';

// ----------------------------------------------------------------------

export default function ImpDocumentPage() {
  return (
    <>
      <Helmet>
        <title> Important Document | LG College </title>
      </Helmet>

      <ImpDocumentView />
    </>
  );
}
