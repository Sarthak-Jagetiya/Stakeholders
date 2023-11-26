import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'user',
    path: '/user',
    icon: icon('ic_user'),
  },
  {
    title: 'register',
    path: '/register',
    icon: icon('ic_register'),
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
    title: 'employee',
    path: '/employee',
    icon: icon('ic_employee'),
  },
  {
    title: 'blog',
    path: '/blog',
    icon: icon('ic_blog'),
  },
  {
    title: 'login',
    path: '/login',
    icon: icon('ic_lock'),
  },
];

export default navConfig;
