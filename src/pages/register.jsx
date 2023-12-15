import { Helmet } from 'react-helmet-async';

import { RegisterView } from 'src/sections/register/view';

// ----------------------------------------------------------------------

export default function ProductsPage() {
  return (
    <>
      <Helmet>
        <title> Register | LG College </title>
      </Helmet>

      <RegisterView />
    </>
  );
}
