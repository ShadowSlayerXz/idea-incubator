import { toast } from 'react-toastify';
import axiosInstance from '../api/axiosInstance';
import useAuthStore from '../store/authStore';

const useAuth = () => {
  const { login, logout, user, isAuthenticated } = useAuthStore();

  const registerUser = async (data) => {
    try {
      const res = await axiosInstance.post('/auth/register', data);
      login(res.data, res.data.token);
      toast.success('Account created successfully!');
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  const loginUser = async (data) => {
    try {
      const res = await axiosInstance.post('/auth/login', data);
      login(res.data, res.data.token);
      toast.success('Welcome back!');
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  const logoutUser = () => {
    logout();
    toast.info('Logged out');
  };

  const fetchMe = async () => {
    try {
      const res = await axiosInstance.get('/auth/me');
      return res.data;
    } catch (err) {
      logout();
      throw err;
    }
  };

  return { registerUser, loginUser, logoutUser, fetchMe, user, isAuthenticated };
};

export default useAuth;
