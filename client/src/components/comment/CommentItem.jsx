import { FiTrash2, FiUser } from 'react-icons/fi';
import useAuthStore from '../../store/authStore';
import { formatDate } from '../../utils/formatDate';

const CommentItem = ({ comment, onDelete }) => {
  const { user, isAuthenticated } = useAuthStore();
  const isOwner = isAuthenticated && user?._id === comment.author?._id;

  return (
    <div className="flex gap-3 py-4 border-b border-gray-100 last:border-0">
      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
        <FiUser size={14} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-gray-800">{comment.author?.name}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
            {isOwner && (
              <button
                onClick={() => onDelete(comment._id)}
                className="text-gray-400 hover:text-red-600 transition-colors"
                title="Delete comment"
              >
                <FiTrash2 size={13} />
              </button>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-1">{comment.text}</p>
      </div>
    </div>
  );
};

export default CommentItem;
