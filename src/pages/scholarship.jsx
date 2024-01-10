import { Helmet } from 'react-helmet-async';

import { ScholarshipView } from 'src/sections/scholarship/view';

// ----------------------------------------------------------------------

export default function scholarshipPage() {
  return (
    <>
      <Helmet>
        <title> Scholarship Form | LG College </title>
      </Helmet>

      <ScholarshipView />
    </>
  );
}
