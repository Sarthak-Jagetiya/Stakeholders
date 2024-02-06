import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const isToken =
  typeof document !== 'undefined' &&
  document.cookie.split('; ').find((row) => row.startsWith('jwt'));

const navConfig = [
  ...(isToken
    ? [
        {
          title: 'fee analysis',
          path: '/fee',
          icon: icon('ic_fee'),
        },
        {
          title: 'students',
          path: '/students',
          icon: icon('ic_student'),
        },
        {
          title: 'documents',
          path: '/documents',
          icon: icon('ic_document'),
        },
        {
          title: 'tution fee transactions',
          path: '/transactions',
          icon: icon('ic_transaction'),
        },
        {
          title: 'scholarships',
          path: '/scholarshiptable',
          icon: icon('ic_scholarship'),
        },
        {
          title: 'fee structure',
          path: '/feestructuretable',
          icon: icon('ic_structure'),
        },
        {
          title: 'results',
          path: '/results',
          icon: icon('ic_result'),
        },
        {
          title: 'Important Documents',
          path: '/impdocuments',
          icon: icon('ic_important'),
        },
        {
          title: 'tasks',
          path: '/tasks',
          icon: icon('ic_task'),
        },
        {
          title: 'employees',
          path: '/employees',
          icon: icon('ic_employee'),
        },
        {
          title: 'logs',
          path: '/logs',
          icon: icon('ic_logs'),
        },
      ]
    : [
        {
          title: 'login',
          path: '/login',
          icon: icon('ic_lock'),
        },
      ]),
];

export default navConfig;
