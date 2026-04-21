import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiLogOut, FiPlusCircle, FiLayout, FiSettings } from 'react-icons/fi';
import useAuthStore from '../../store/authStore';
import useAuth from '../../hooks/useAuth';

const ROLE_COLORS = {
  mentor: 'bg-green-100 text-green-700',
  admin: 'bg-red-100 text-red-700',
};

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
    setDropdownOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-indigo-600 tracking-tight">
          IdeaIncubator
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">Home</Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors flex items-center gap-1">
                <FiLayout size={14} /> Dashboard
              </Link>
              <Link to="/ideas/create" className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors">
                <FiPlusCircle size={14} /> New Idea
              </Link>
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm">
                    {user?.name?.[0]?.toUpperCase() || <FiUser />}
                  </div>
                  {user?.role && user.role !== 'student' && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${ROLE_COLORS[user.role]}`}>
                      {user.role}
                    </span>
                  )}
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50">
                    <Link to={`/profile/${user?._id}`} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setDropdownOpen(false)}>
                      <FiUser size={14} /> Profile
                    </Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setDropdownOpen(false)}>
                        <FiSettings size={14} /> Admin
                      </Link>
                    )}
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      <FiLogOut size={14} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">Login</Link>
              <Link to="/register" className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors">Get Started</Link>
            </>
          )}
        </div>

        <button className="md:hidden text-gray-600" onClick={() => setMenuOpen((o) => !o)}>
          {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-3">
          <Link to="/" className="text-sm text-gray-700" onClick={() => setMenuOpen(false)}>Home</Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-sm text-gray-700" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/ideas/create" className="text-sm text-gray-700" onClick={() => setMenuOpen(false)}>New Idea</Link>
              <Link to={`/profile/${user?._id}`} className="text-sm text-gray-700" onClick={() => setMenuOpen(false)}>Profile</Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="text-sm text-gray-700" onClick={() => setMenuOpen(false)}>Admin</Link>
              )}
              <button onClick={handleLogout} className="text-sm text-red-600 text-left">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-700" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="text-sm text-gray-700" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
