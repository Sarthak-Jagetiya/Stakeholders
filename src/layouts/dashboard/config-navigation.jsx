import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  // {
  //   title: 'dashboard',
  //   path: '/',
  //   icon: icon('ic_analytics'),
  // },
  // {
  //   title: 'user',
  //   path: '/user',
  //   icon: icon('ic_user'),
  // },
  {
    title: 'fee analysis',
    path: '/fee',
    icon: icon('ic_fee'),
  },
  {
    title: 'register',
    path: '/register',
    icon: icon('ic_register'),
  },
  {
    title: 'employee',
    path: '/employee',
    icon: icon('ic_employee'),
  },
  {
    title: 'document',
    path: '/document',
    icon: icon('ic_document'),
  },
  {
    title: 'transaction',
    path: '/transaction',
    icon: icon('ic_transaction'),
  },
  {
    title: 'important document',
    path: '/impdocument',
    icon: icon('ic_important'),
  },
  {
    title: 'fee structure',
    path: '/feestructure',
    icon: icon('ic_structure'),
  },
  {
    title: 'task',
    path: '/task',
    icon: icon('ic_task'),
  },
  {
    title: '--Tables--',
  },
  {
    title: 'document-table',
    path: '/documents',
    icon: icon('ic_document'),
  },
  {
    title: 'transaction-table',
    path: '/transactions',
    icon: icon('ic_transaction'),
  },
  {
    title: 'ImpDocument-table',
    path: '/impdocuments',
    icon: icon('ic_important'),
  },
  {
    title: 'fee structure-table',
    path: '/feestructuretable',
    icon: icon('ic_structure'),
  },
  {
    title: 'task-table',
    path: '/tasks',
    icon: icon('ic_task'),
  },
  // {
  //   title: 'blog',
  //   path: '/blog',
  //   icon: icon('ic_blog'),
  // },
  {
    title: 'login',
    path: '/login',
    icon: icon('ic_lock'),
  },
];

export default navConfig;
