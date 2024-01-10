import { Helmet } from 'react-helmet-async';

import { StudentsView } from 'src/sections/students/view';

// ----------------------------------------------------------------------

export default function StudentsPage() {
  return (
    <>
      <Helmet>
        <title> Students | LG College </title>
      </Helmet>

      <StudentsView />
    </>
  );
}
