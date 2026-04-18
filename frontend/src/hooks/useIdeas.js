import { toast } from 'react-toastify';
import axiosInstance from '../api/axiosInstance';
import useIdeaStore from '../store/ideaStore';

const useIdeas = () => {
  const { setIdeas, setSelectedIdea, setLoading, setError, pagination } = useIdeaStore();

  const fetchIdeas = async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.tags) params.append('tags', filters.tags);
      if (filters.page) params.append('page', filters.page);

      const res = await axiosInstance.get(`/ideas?${params.toString()}`);
      setIdeas(res.data.ideas, {
        total: res.data.total,
        page: res.data.page,
        pages: res.data.pages,
      });
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch ideas');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchIdeaById = async (id) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/ideas/${id}`);
      setSelectedIdea(res.data);
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load idea');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createIdea = async (data) => {
    try {
      const res = await axiosInstance.post('/ideas', data);
      toast.success('Idea submitted!');
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create idea');
      throw err;
    }
  };

  const updateIdea = async (id, data) => {
    try {
      const res = await axiosInstance.put(`/ideas/${id}`, data);
      toast.success('Idea updated!');
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update idea');
      throw err;
    }
  };

  const deleteIdea = async (id) => {
    try {
      await axiosInstance.delete(`/ideas/${id}`);
      toast.success('Idea deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete idea');
      throw err;
    }
  };

  const toggleInterest = async (id) => {
    try {
      const res = await axiosInstance.patch(`/ideas/${id}/interest`);
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update interest');
      throw err;
    }
  };

  return { fetchIdeas, fetchIdeaById, createIdea, updateIdea, deleteIdea, toggleInterest, pagination };
};

export default useIdeas;
