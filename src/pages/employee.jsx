import { Helmet } from 'react-helmet-async';

import { EmployeeView } from 'src/sections/employee/view';

// ----------------------------------------------------------------------

export default function ProductsPage() {
  return (
    <>
      <Helmet>
        <title> Employee Enroll Form </title>
      </Helmet>

      <EmployeeView />
    </>
  );
}
