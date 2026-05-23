import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppShell from './components/layout/AppShell';

// Eagerly load critical path
import LandingPage from './pages/LandingPage';
import LoginPage   from './pages/LoginPage';

// Lazy-load all dashboard routes
const DashboardPage    = lazy(() => import('./pages/DashboardPage'));
const AnalyticsPage    = lazy(() => import('./pages/AnalyticsPage'));
const URLScannerPage   = lazy(() => import('./pages/URLScannerPage'));
const EmailScannerPage = lazy(() => import('./pages/EmailScannerPage'));
const AttachmentScannerPage = lazy(() => import('./pages/AttachmentScannerPage'));
const PromptScannerPage= lazy(() => import('./pages/PromptScannerPage'));
const ThreatLogsPage   = lazy(() => import('./pages/ThreatLogsPage'));
const APIKeysPage      = lazy(() => import('./pages/APIKeysPage'));
const SettingsPage     = lazy(() => import('./pages/SettingsPage'));
const ProfilePage      = lazy(() => import('./pages/ProfilePage'));

function PageLoader() {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'80px', color:'var(--ink-3)', fontFamily:'var(--f-mono)', fontSize:11 }}>
      <span style={{ animation:'pulse-slow 1.5s ease-in-out infinite' }}>Loading…</span>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthed } = useAuth();
  return isAuthed ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { isAuthed } = useAuth();
  return !isAuthed ? children : <Navigate to="/dashboard" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/"      element={<PublicRoute><LandingPage /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route
        path="/"
        element={<ProtectedRoute><AppShell /></ProtectedRoute>}
      >
        <Route path="dashboard"       element={<Suspense fallback={<PageLoader />}><DashboardPage /></Suspense>} />
        <Route path="analytics"       element={<Suspense fallback={<PageLoader />}><AnalyticsPage /></Suspense>} />
        <Route path="scan/url"        element={<Suspense fallback={<PageLoader />}><URLScannerPage /></Suspense>} />
        <Route path="scan/email"      element={<Suspense fallback={<PageLoader />}><EmailScannerPage /></Suspense>} />
        <Route path="scan/attachment" element={<Suspense fallback={<PageLoader />}><AttachmentScannerPage /></Suspense>} />
        <Route path="scan/prompt"     element={<Suspense fallback={<PageLoader />}><PromptScannerPage /></Suspense>} />
        <Route path="logs"            element={<Suspense fallback={<PageLoader />}><ThreatLogsPage /></Suspense>} />
        <Route path="api-keys"        element={<Suspense fallback={<PageLoader />}><APIKeysPage /></Suspense>} />
        <Route path="settings"        element={<Suspense fallback={<PageLoader />}><SettingsPage /></Suspense>} />
        <Route path="profile"         element={<Suspense fallback={<PageLoader />}><ProfilePage /></Suspense>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--surface-3)',
              color: 'var(--ink-0)',
              border: '1px solid var(--line-2)',
              fontFamily: 'var(--f-body)',
              fontSize: 13,
              borderRadius: 'var(--r-md)',
            },
            success: { iconTheme: { primary: 'var(--a)', secondary: 'var(--base)' } },
            error:   { iconTheme: { primary: 'var(--crit)', secondary: '#fff' } },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}
