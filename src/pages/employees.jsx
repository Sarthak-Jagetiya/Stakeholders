import { Helmet } from 'react-helmet-async';

import { EmployeesTable } from 'src/sections/employees/view';

// ----------------------------------------------------------------------

export default function EmployeesPage() {
  return (
    <>
      <Helmet>
        <title> Employee | LG College </title>
      </Helmet>

      <EmployeesTable />
    </>
  );
}
