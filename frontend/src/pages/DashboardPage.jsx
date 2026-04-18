import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlusCircle } from 'react-icons/fi';
import IdeaList from '../components/idea/IdeaList';
import Modal from '../components/common/Modal';
import axiosInstance from '../api/axiosInstance';
import useAuthStore from '../store/authStore';
import useIdeas from '../hooks/useIdeas';
import { toast } from 'react-toastify';

const DashboardPage = () => {
  const { user } = useAuthStore();
  const { deleteIdea } = useIdeas();
  const [tab, setTab] = useState('mine');
  const [myIdeas, setMyIdeas] = useState([]);
  const [collabIdeas, setCollabIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  useEffect(() => {
    loadIdeas();
  }, []);

  const loadIdeas = async () => {
    setLoading(true);
    try {
      const [allRes] = await Promise.all([axiosInstance.get('/ideas?limit=100')]);
      const all = allRes.data.ideas;
      setMyIdeas(all.filter((i) => i.author?._id === user?._id));
      setCollabIdeas(all.filter((i) => i.interestedUsers?.some((u) => u === user?._id || u?._id === user?._id)));
    } catch {
      toast.error('Failed to load ideas');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteIdea(deleteModal.id);
      setMyIdeas((prev) => prev.filter((i) => i._id !== deleteModal.id));
    } finally {
      setDeleteModal({ open: false, id: null });
    }
  };

  const stats = [
    { label: 'Ideas Submitted', value: myIdeas.length },
    { label: 'Collaborating On', value: collabIdeas.length },
    { label: 'Interest Received', value: myIdeas.reduce((acc, i) => acc + (i.interestedUsers?.length || 0), 0) },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">Welcome back, {user?.name}</p>
          </div>
          <Link
            to="/ideas/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            <FiPlusCircle size={15} /> New Idea
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-indigo-600">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-6">
          {[{ key: 'mine', label: 'My Ideas' }, { key: 'collab', label: 'Collaborating' }].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <IdeaList
          ideas={tab === 'mine' ? myIdeas : collabIdeas}
          loading={loading}
          onDelete={(id) => setDeleteModal({ open: true, id })}
        />
      </div>

      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Idea"
        message="Are you sure you want to delete this idea? This action cannot be undone."
      />
    </div>
  );
};

export default DashboardPage;
