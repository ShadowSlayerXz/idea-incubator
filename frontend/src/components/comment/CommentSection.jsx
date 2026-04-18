import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import CommentItem from './CommentItem';
import Spinner from '../common/Spinner';
import axiosInstance from '../../api/axiosInstance';
import useAuthStore from '../../store/authStore';

const CommentSection = ({ ideaId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchComments();
  }, [ideaId]);

  const fetchComments = async () => {
    try {
      const res = await axiosInstance.get(`/comments/idea/${ideaId}`);
      setComments(res.data);
    } catch {
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      const res = await axiosInstance.post(`/comments/idea/${ideaId}`, { text });
      setComments((prev) => [...prev, res.data]);
      setText('');
    } catch {
      toast.error('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await axiosInstance.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success('Comment deleted');
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Comments ({comments.length})
      </h3>

      {isAuthenticated && (
        <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
          />
          <button
            type="submit"
            disabled={submitting || !text.trim()}
            className="self-end px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium disabled:opacity-60"
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      )}

      {loading ? (
        <Spinner size="sm" />
      ) : comments.length === 0 ? (
        <p className="text-gray-400 text-sm py-4">No comments yet. Be the first!</p>
      ) : (
        <div>
          {comments.map((c) => (
            <CommentItem key={c._id} comment={c} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
