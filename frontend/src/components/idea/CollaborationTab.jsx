import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUserPlus, FiCheck, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axiosInstance';
import useAuthStore from '../../store/authStore';

const CollaborationTab = ({ idea, onIdeaUpdate }) => {
  const { user, isAuthenticated } = useAuthStore();
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [responding, setResponding] = useState(false);

  const isOwner = isAuthenticated && user?._id === idea?.author?._id;
  const isMember = idea?.collaborators?.some((c) => (c._id || c) === user?._id);
  const canRequest = isAuthenticated && !isOwner && !isMember;

  useEffect(() => {
    if (!isOwner) return;
    axiosInstance
      .get(`/collaboration/ideas/${idea._id}/requests`)
      .then((res) => setRequests(res.data))
      .catch(() => {});
  }, [idea._id, isOwner]);

  const handleRequest = async () => {
    setSubmitting(true);
    try {
      await axiosInstance.post(`/collaboration/ideas/${idea._id}/requests`, { message });
      setMessage('');
      toast.success('Request sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRespond = async (requestId, status) => {
    setResponding(true);
    try {
      const res = await axiosInstance.patch(
        `/collaboration/ideas/${idea._id}/requests/${requestId}`,
        { status }
      );
      setRequests((prev) => prev.map((r) => (r._id === requestId ? res.data : r)));
      if (status === 'approved') {
        toast.success('Collaborator approved!');
        onIdeaUpdate();
      } else {
        toast.success('Request rejected');
      }
    } catch {
      toast.error('Failed to respond to request');
    } finally {
      setResponding(false);
    }
  };

  const pendingRequests = requests.filter((r) => r.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Team members */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Team</h3>
        <div className="flex flex-wrap gap-2">
          <Link
            to={`/profile/${idea.author?._id}`}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-50 rounded-xl text-sm text-indigo-700 hover:bg-indigo-100 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-indigo-200 flex items-center justify-center text-xs font-bold">
              {idea.author?.name?.[0]?.toUpperCase()}
            </div>
            {idea.author?.name}
            <span className="text-xs text-indigo-400">(creator)</span>
          </Link>
          {idea.collaborators?.map((c) => (
            <Link
              key={c._id}
              to={`/profile/${c._id}`}
              className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
                {c.name?.[0]?.toUpperCase()}
              </div>
              {c.name}
            </Link>
          ))}
          {idea.collaborators?.length === 0 && (
            <p className="text-sm text-gray-400">No collaborators yet.</p>
          )}
        </div>
      </div>

      {/* Request to join */}
      {canRequest && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Request to Join</h3>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your skills and why you want to join (optional)"
            rows={3}
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none mb-3"
          />
          <button
            onClick={handleRequest}
            disabled={submitting}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60"
          >
            <FiUserPlus size={14} />
            {submitting ? 'Sending...' : 'Send Request'}
          </button>
        </div>
      )}

      {/* Pending requests (owner only) */}
      {isOwner && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Join Requests {pendingRequests.length > 0 && `(${pendingRequests.length})`}
          </h3>
          {pendingRequests.length === 0 ? (
            <p className="text-sm text-gray-400">No pending requests.</p>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map((r) => (
                <div
                  key={r._id}
                  className="flex items-start justify-between gap-4 p-3 border border-gray-200 rounded-xl"
                >
                  <div>
                    <Link
                      to={`/profile/${r.requester._id}`}
                      className="text-sm font-medium text-gray-800 hover:text-indigo-600"
                    >
                      {r.requester.name}
                    </Link>
                    {r.message && <p className="text-xs text-gray-500 mt-1">{r.message}</p>}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleRespond(r._id, 'approved')}
                      disabled={responding}
                      className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 text-xs rounded-lg hover:bg-green-100 transition-colors disabled:opacity-60"
                    >
                      <FiCheck size={12} /> Approve
                    </button>
                    <button
                      onClick={() => handleRespond(r._id, 'rejected')}
                      disabled={responding}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 text-xs rounded-lg hover:bg-red-100 transition-colors disabled:opacity-60"
                    >
                      <FiX size={12} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isMember && (
        <p className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">You are a team member of this project.</p>
      )}

      {!isAuthenticated && (
        <p className="text-sm text-gray-500">
          <Link to="/login" className="text-indigo-600 hover:underline">Log in</Link> to request to join this project.
        </p>
      )}
    </div>
  );
};

export default CollaborationTab;
