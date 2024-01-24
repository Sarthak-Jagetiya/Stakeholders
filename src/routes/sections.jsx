import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

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
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <FeePage />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'register', element: <RegisterPage /> },
        { path: 'students', element: <StudentsPage /> },
        { path: 'fee', element: <FeePage /> },
        { path: 'feestructure', element: <FeeStructurePage /> },
        { path: 'feestructuretable', element: <FeeStructureTablePage /> },
        { path: 'document', element: <DocumentPage /> },
        { path: 'documents', element: <DocumentsPage /> },
        { path: 'impdocument', element: <ImpDocumentPage /> },
        { path: 'impdocuments', element: <ImpDocumentsPage /> },
        { path: 'transaction', element: <TransactionPage /> },
        { path: 'transactions', element: <TransactionsPage /> },
        { path: 'employee', element: <EmployeePage /> },
        { path: 'employees', element: <EmployeesPage /> },
        { path: 'scholarship', element: <ScholarshipPage /> },
        { path: 'scholarshiptable', element: <ScholarshipTablePage /> },
        { path: 'task', element: <TaskPage /> },
        { path: 'tasks', element: <TasksPage /> },
        { path: 'blog', element: <BlogPage /> },
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
