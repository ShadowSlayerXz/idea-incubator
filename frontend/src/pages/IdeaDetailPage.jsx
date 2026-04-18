import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiHeart, FiArrowLeft, FiEdit2, FiTrash2, FiUser } from 'react-icons/fi';
import CommentSection from '../components/comment/CommentSection';
import Spinner from '../components/common/Spinner';
import Modal from '../components/common/Modal';
import useIdeas from '../hooks/useIdeas';
import useIdeaStore from '../store/ideaStore';
import useAuthStore from '../store/authStore';
import { formatDate } from '../utils/formatDate';

const CATEGORY_COLORS = {
  Tech: 'bg-blue-100 text-blue-700',
  Business: 'bg-green-100 text-green-700',
  Social: 'bg-yellow-100 text-yellow-700',
  Science: 'bg-purple-100 text-purple-700',
  Art: 'bg-pink-100 text-pink-700',
  Other: 'bg-gray-100 text-gray-700',
};

const STATUS_COLORS = {
  open: 'bg-green-100 text-green-700',
  'in-progress': 'bg-yellow-100 text-yellow-700',
  completed: 'bg-gray-100 text-gray-700',
};

const IdeaDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchIdeaById, deleteIdea, toggleInterest } = useIdeas();
  const { selectedIdea: idea } = useIdeaStore();
  const { user, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [interestLoading, setInterestLoading] = useState(false);

  useEffect(() => {
    fetchIdeaById(id).finally(() => setLoading(false));
  }, [id]);

  const isOwner = isAuthenticated && user?._id === idea?.author?._id;
  const isInterested = idea?.interestedUsers?.some((u) => u._id === user?._id || u === user?._id);

  const handleInterest = async () => {
    if (!isAuthenticated) return navigate('/login');
    setInterestLoading(true);
    try {
      await toggleInterest(id);
      await fetchIdeaById(id);
    } finally {
      setInterestLoading(false);
    }
  };

  const handleDelete = async () => {
    await deleteIdea(id);
    navigate('/dashboard');
  };

  if (loading) return <div className="py-20"><Spinner /></div>;
  if (!idea) return <div className="text-center py-20 text-gray-400">Idea not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Back */}
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 mb-6 transition-colors">
          <FiArrowLeft size={14} /> Back to ideas
        </Link>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${CATEGORY_COLORS[idea.category] || CATEGORY_COLORS.Other}`}>
              {idea.category}
            </span>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[idea.status]}`}>
              {idea.status}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{idea.title}</h1>

          {/* Author & date */}
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
            <Link to={`/profile/${idea.author?._id}`} className="flex items-center gap-2 hover:text-indigo-600 transition-colors">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <FiUser size={14} />
              </div>
              <span className="text-sm font-medium text-gray-700">{idea.author?.name}</span>
            </Link>
            <span className="text-gray-300">·</span>
            <span className="text-sm text-gray-400">{formatDate(idea.createdAt)}</span>

            {isOwner && (
              <div className="flex gap-2 ml-auto">
                <Link
                  to={`/ideas/${id}/edit`}
                  className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <FiEdit2 size={15} />
                </Link>
                <button
                  onClick={() => setDeleteModal(true)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <FiTrash2 size={15} />
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-700 leading-relaxed mb-6">{idea.description}</p>

          {/* Tags */}
          {idea.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {idea.tags.map((tag) => (
                <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Interest */}
          <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
            <button
              onClick={handleInterest}
              disabled={interestLoading}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isInterested
                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                  : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
              } disabled:opacity-60`}
            >
              <FiHeart size={15} className={isInterested ? 'fill-red-500 text-red-500' : ''} />
              {isInterested ? 'Remove Interest' : 'Express Interest'}
            </button>
            <span className="text-sm text-gray-500">
              {idea.interestedUsers?.length || 0} interested
            </span>
          </div>
        </div>

        <CommentSection ideaId={id} />
      </div>

      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Idea"
        message="Are you sure you want to delete this idea? This cannot be undone."
      />
    </div>
  );
};

export default IdeaDetailPage;
