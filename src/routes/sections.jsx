// import Cookies from 'js-cookie';
import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

const isToken =
  (typeof document !== 'undefined' &&
    document.cookie.split('; ').find((row) => row.startsWith('jwt'))) ||
  localStorage.getItem('jwt');

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const SignupPage = lazy(() => import('src/pages/signup'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const RegisterPage = lazy(() => import('src/pages/register'));
export const StudentsPage = lazy(() => import('src/pages/students'));
export const DocumentPage = lazy(() => import('src/pages/document'));
export const DocumentsPage = lazy(() => import('src/pages/documents'));
export const ImpDocumentPage = lazy(() => import('src/pages/impdocument'));
export const ImpDocumentsPage = lazy(() => import('src/pages/impdocuments'));
export const ResultPage = lazy(() => import('src/pages/result'));
export const ResultsPage = lazy(() => import('src/pages/results'));
export const TransactionPage = lazy(() => import('src/pages/transaction'));
export const TransactionsPage = lazy(() => import('src/pages/transactions'));
export const FeePage = lazy(() => import('src/pages/fee'));
export const FeeStructurePage = lazy(() => import('src/pages/feeStructure'));
export const FeeStructureTablePage = lazy(() => import('src/pages/feeStructureTable'));
export const EmployeePage = lazy(() => import('src/pages/employee'));
export const EmployeesPage = lazy(() => import('src/pages/employees'));
export const ScholarshipPage = lazy(() => import('src/pages/scholarship'));
export const ScholarshipTablePage = lazy(() => import('src/pages/scholarshiptable'));
export const TaskPage = lazy(() => import('src/pages/task'));
export const TasksPage = lazy(() => import('src/pages/tasks'));
export const LogsPage = lazy(() => import('src/pages/logs'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: isToken ? (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ) : (
        <Navigate to="/login" replace />
      ),
      children: [
        { element: <FeePage />, index: true },
        { path: 'register', element: <RegisterPage /> },
        { path: 'students', element: <StudentsPage /> },
        { path: 'fee', element: <FeePage /> },
        { path: 'feestructure', element: <FeeStructurePage /> },
        { path: 'feestructuretable', element: <FeeStructureTablePage /> },
        { path: 'document', element: <DocumentPage /> },
        { path: 'documents', element: <DocumentsPage /> },
        { path: 'impdocument', element: <ImpDocumentPage /> },
        { path: 'impdocuments', element: <ImpDocumentsPage /> },
        { path: 'result', element: <ResultPage /> },
        { path: 'results', element: <ResultsPage /> },
        { path: 'transaction', element: <TransactionPage /> },
        { path: 'transactions', element: <TransactionsPage /> },
        { path: 'employee', element: <EmployeePage /> },
        { path: 'employees', element: <EmployeesPage /> },
        { path: 'scholarship', element: <ScholarshipPage /> },
        { path: 'scholarshiptable', element: <ScholarshipTablePage /> },
        { path: 'task', element: <TaskPage /> },
        { path: 'tasks', element: <TasksPage /> },
        { path: 'Logs', element: <LogsPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'signup',
      element: <SignupPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
