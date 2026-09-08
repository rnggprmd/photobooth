import { createBrowserRouter, Navigate } from 'react-router-dom';

import AppLayout from '../layouts/AppLayout';
import AuthLayout from '../layouts/AuthLayout';
import BoothLayout from '../layouts/BoothLayout';

import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

import DashboardPage from '../pages/dashboard/DashboardPage';
import EventsPage from '../pages/events/EventsPage';
import TemplatesPage from '../pages/templates/TemplatesPage';
import PackagesPage from '../pages/packages/PackagesPage';
import SessionsPage from '../pages/sessions/SessionsPage';
import GalleryPage from '../pages/gallery/GalleryPage';
import CustomersPage from '../pages/customers/CustomersPage';
import TransactionsPage from '../pages/transactions/TransactionsPage';
import ReportsPage from '../pages/reports/ReportsPage';
import SettingsPage from '../pages/settings/SettingsPage';

import BoothOnsitePage from '../pages/photobooth/BoothOnsitePage';
import BoothOnlinePage from '../pages/photobooth/BoothOnlinePage';
import ResultPublicPage from '../pages/gallery/ResultPublicPage';

import SuperAdminTenantsPage from '../pages/superadmin/TenantsPage';
import SuperAdminPlansPage from '../pages/superadmin/PlansPage';

export const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter([
  // Main Dashboard App
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'events', element: <EventsPage /> },
      { path: 'templates', element: <TemplatesPage /> },
      { path: 'packages', element: <PackagesPage /> },
      { path: 'sessions', element: <SessionsPage /> },
      { path: 'gallery', element: <GalleryPage /> },
      { path: 'customers', element: <CustomersPage /> },
      { path: 'transactions', element: <TransactionsPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'subscription', element: <SuperAdminPlansPage /> },
      { path: 'superadmin/tenants', element: <SuperAdminTenantsPage /> },
      { path: 'superadmin/plans', element: <SuperAdminPlansPage /> },
    ],
  },

  // Auth Routes
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="/auth/login" replace /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },

  // Photobooth Execution Routes
  {
    path: '/booth',
    element: <BoothLayout />,
    children: [
      { path: 'onsite', element: <BoothOnsitePage /> },
      { path: 'online/:slug', element: <BoothOnlinePage /> },
    ],
  },

  // Public Result Delivery (QR Code Link)
  {
    path: '/results/:token',
    element: <ResultPublicPage />,
  },

  // Catch-all
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export default router;
