import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const RegisterPage = lazy(() => import('src/pages/register'));
export const DocumentPage = lazy(() => import('src/pages/document'));
export const DocumentsPage = lazy(() => import('src/pages/documents'));
export const TransactionPage = lazy(() => import('src/pages/transaction'));
export const TransactionsPage = lazy(() => import('src/pages/transactions'));
export const EmployeePage = lazy(() => import('src/pages/employee'));
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
        { element: <IndexPage />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'register', element: <RegisterPage /> },
        { path: 'document', element: <DocumentPage /> },
        { path: 'documents', element: <DocumentsPage /> },
        { path: `transaction`, element: <TransactionPage /> },
        { path: 'transactions', element: <TransactionsPage /> },
        { path: 'employee', element: <EmployeePage /> },
        { path: 'blog', element: <BlogPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
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
