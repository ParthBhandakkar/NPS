import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import UploadReport from './pages/admin/UploadReport';
import Reports from './pages/admin/Reports';
import ReportDetail from './pages/admin/ReportDetail';
import Patients from './pages/admin/Patients';
import AuditLogs from './pages/admin/AuditLogs';

// Patient Pages
import PatientDashboard from './pages/patient/Dashboard';
import VideoPlayer from './pages/patient/VideoPlayer';
import PatientProfile from './pages/patient/Profile';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/admin" replace />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><Layout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="upload" element={<UploadReport />} />
            <Route path="reports" element={<Reports />} />
            <Route path="reports/:id" element={<ReportDetail />} />
            <Route path="patients" element={<Patients />} />
            <Route path="audit" element={<AuditLogs />} />
          </Route>

          {/* Patient Routes */}
          <Route path="/patient" element={<ProtectedRoute requiredRole="patient"><Layout /></ProtectedRoute>}>
            <Route index element={<PatientDashboard />} />
            <Route path="videos" element={<Navigate to="/patient" replace />} />
            <Route path="videos/:id" element={<VideoPlayer />} />
            <Route path="profile" element={<PatientProfile />} />
          </Route>
        </Routes>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#fff',
              color: '#1e293b',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error: { iconTheme: { primary: '#f43f5e', secondary: '#fff' } },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}
