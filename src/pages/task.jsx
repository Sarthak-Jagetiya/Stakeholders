import { Helmet } from 'react-helmet-async';

import { TaskView } from 'src/sections/task/view';

// ----------------------------------------------------------------------

export default function TaskPage() {
  return (
    <>
      <Helmet>
        <title> Task | LG College </title>
      </Helmet>

      <TaskView />
    </>
  );
}
