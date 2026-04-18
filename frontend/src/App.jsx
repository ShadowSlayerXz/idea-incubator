import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import IdeaDetailPage from './pages/IdeaDetailPage';
import CreateIdeaPage from './pages/CreateIdeaPage';
import EditIdeaPage from './pages/EditIdeaPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

import useAuthStore from './store/authStore';

const AuthRedirect = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

const Layout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public with layout */}
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/ideas/:id" element={<Layout><IdeaDetailPage /></Layout>} />
        <Route path="/profile/:id" element={<Layout><ProfilePage /></Layout>} />

        {/* Auth pages (redirect if already logged in) */}
        <Route path="/login" element={<AuthRedirect><LoginPage /></AuthRedirect>} />
        <Route path="/register" element={<AuthRedirect><RegisterPage /></AuthRedirect>} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
          <Route path="/ideas/create" element={<Layout><CreateIdeaPage /></Layout>} />
          <Route path="/ideas/:id/edit" element={<Layout><EditIdeaPage /></Layout>} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} pauseOnHover />
    </BrowserRouter>
  );
}

export default App;
