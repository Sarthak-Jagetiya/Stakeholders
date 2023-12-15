import { Helmet } from 'react-helmet-async';

import { TasksTable } from 'src/sections/tasks/view';

// ----------------------------------------------------------------------

export default function TasksPage() {
  return (
    <>
      <Helmet>
        <title> Task-Table | LG College </title>
      </Helmet>

      <TasksTable />
    </>
  );
}
