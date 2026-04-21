import { useState, useEffect } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axiosInstance';
import useAuthStore from '../../store/authStore';
import { formatDate } from '../../utils/formatDate';

const UpdatesTab = ({ idea }) => {
  const { user, isAuthenticated } = useAuthStore();
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isOwner = isAuthenticated && user?._id === idea?.author?._id;
  const isMember = idea?.collaborators?.some((c) => (c._id || c) === user?._id);
  const isMentor = user?.role === 'mentor';
  const isAdmin = user?.role === 'admin';
  const canPost = isOwner || isMember || isMentor;

  useEffect(() => {
    axiosInstance
      .get(`/updates/idea/${idea._id}`)
      .then((res) => setUpdates(res.data))
      .catch(() => toast.error('Failed to load updates'))
      .finally(() => setLoading(false));
  }, [idea._id]);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);
    try {
      const res = await axiosInstance.post(`/updates/idea/${idea._id}`, { message });
      setUpdates((prev) => [res.data, ...prev]);
      setMessage('');
      toast.success('Posted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (updateId) => {
    try {
      await axiosInstance.delete(`/updates/${updateId}`);
      setUpdates((prev) => prev.filter((u) => u._id !== updateId));
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <p className="text-sm text-gray-400">Loading updates...</p>;

  return (
    <div className="space-y-4">
      {canPost && (
        <form onSubmit={handlePost} className="flex flex-col gap-3">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isMentor ? 'Share your feedback on this project...' : 'Share a project update...'}
            rows={3}
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
          />
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting || !message.trim()}
              className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-60 transition-colors"
            >
              {submitting ? 'Posting...' : isMentor ? 'Post Feedback' : 'Post Update'}
            </button>
            {isMentor && (
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">Posting as mentor feedback</span>
            )}
          </div>
        </form>
      )}

      {updates.length === 0 ? (
        <p className="text-sm text-gray-400">No updates yet.</p>
      ) : (
        <div className="space-y-3">
          {updates.map((u) => (
            <div
              key={u._id}
              className={`p-4 rounded-xl border ${
                u.type === 'feedback' ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold">
                    {u.author?.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-800">{u.author?.name}</span>
                    {u.type === 'feedback' && (
                      <span className="text-xs text-green-700 bg-green-100 px-1.5 py-0.5 rounded-full">Mentor Feedback</span>
                    )}
                  </div>
                </div>
                {(u.author?._id === user?._id || isAdmin) && (
                  <button
                    onClick={() => handleDelete(u._id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FiTrash2 size={13} />
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-700 mt-2 leading-relaxed">{u.message}</p>
              <p className="text-xs text-gray-400 mt-2">{formatDate(u.createdAt)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpdatesTab;
