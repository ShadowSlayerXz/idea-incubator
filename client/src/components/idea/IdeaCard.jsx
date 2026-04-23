import { Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiEdit2, FiTrash2, FiUser } from 'react-icons/fi';
import useAuthStore from '../../store/authStore';

const CATEGORY_COLORS = {
  Tech: 'bg-blue-100 text-blue-700',
  Business: 'bg-green-100 text-green-700',
  Social: 'bg-yellow-100 text-yellow-700',
  Science: 'bg-purple-100 text-purple-700',
  Art: 'bg-pink-100 text-pink-700',
  Other: 'bg-gray-100 text-gray-700',
};

const IdeaCard = ({ idea, onDelete }) => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const isOwner = isAuthenticated && user?._id === idea.author?._id;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${CATEGORY_COLORS[idea.category] || CATEGORY_COLORS.Other}`}>
          {idea.category}
        </span>
        {isOwner && (
          <div className="flex gap-1.5 shrink-0">
            <button
              onClick={() => navigate(`/ideas/${idea._id}/edit`)}
              className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Edit"
            >
              <FiEdit2 size={14} />
            </button>
            <button
              onClick={() => onDelete && onDelete(idea._id)}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <FiTrash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Title & description */}
      <div>
        <h3 className="font-semibold text-gray-900 text-base leading-snug mb-1 line-clamp-2">{idea.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{idea.description}</p>
      </div>

      {/* Tags */}
      {idea.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {idea.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            <FiUser size={11} />
          </div>
          <span className="truncate max-w-[100px]">{idea.author?.name}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <FiHeart size={13} />
          <span>{idea.interestedUsers?.length || 0}</span>
        </div>
      </div>

      <Link
        to={`/ideas/${idea._id}`}
        className="block text-center py-2 rounded-lg border border-indigo-200 text-indigo-600 text-sm hover:bg-indigo-50 transition-colors"
      >
        View Details
      </Link>
    </div>
  );
};

export default IdeaCard;
