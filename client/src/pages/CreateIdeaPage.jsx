import { useNavigate } from 'react-router-dom';
import IdeaForm from '../components/idea/IdeaForm';
import useIdeas from '../hooks/useIdeas';

const CreateIdeaPage = () => {
  const { createIdea } = useIdeas();
  const navigate = useNavigate();

  const handleSubmit = async (data, setSubmitting) => {
    try {
      const idea = await createIdea(data);
      navigate(`/ideas/${idea._id}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Submit a New Idea</h1>
        <p className="text-sm text-gray-500 mb-8">Share your research or startup idea with the community</p>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
          <IdeaForm onSubmit={handleSubmit} submitLabel="Submit Idea" />
        </div>
      </div>
    </div>
  );
};

export default CreateIdeaPage;
