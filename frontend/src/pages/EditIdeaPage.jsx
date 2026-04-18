import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import IdeaForm from '../components/idea/IdeaForm';
import Spinner from '../components/common/Spinner';
import useIdeas from '../hooks/useIdeas';
import useIdeaStore from '../store/ideaStore';
import useAuthStore from '../store/authStore';

const EditIdeaPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchIdeaById, updateIdea } = useIdeas();
  const { selectedIdea: idea } = useIdeaStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIdeaById(id).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (idea && user && idea.author?._id !== user._id) {
      navigate(`/ideas/${id}`);
    }
  }, [idea, user]);

  const handleSubmit = async (data, setSubmitting) => {
    try {
      await updateIdea(id, data);
      navigate(`/ideas/${id}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="py-20"><Spinner /></div>;

  const initialValues = idea
    ? { title: idea.title, description: idea.description, category: idea.category, tags: idea.tags?.join(', ') || '', status: idea.status || 'open' }
    : {};

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Edit Idea</h1>
        <p className="text-sm text-gray-500 mb-8">Update your idea details</p>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
          <IdeaForm initialValues={initialValues} onSubmit={handleSubmit} submitLabel="Save Changes" showStatus />
        </div>
      </div>
    </div>
  );
};

export default EditIdeaPage;
