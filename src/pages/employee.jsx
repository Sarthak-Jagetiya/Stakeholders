import { Helmet } from 'react-helmet-async';

import { EmployeeView } from 'src/sections/employee/view';

// ----------------------------------------------------------------------

export default function ProductsPage() {
  return (
    <>
      <Helmet>
        <title> Employee | LG College </title>
      </Helmet>

      <EmployeeView />
    </>
  );
}
