import IdeaCard from './IdeaCard';
import Spinner from '../common/Spinner';

const IdeaList = ({ ideas, loading, onDelete }) => {
  if (loading) return <Spinner />;

  if (!ideas?.length) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-lg">No ideas found</p>
        <p className="text-sm mt-1">Be the first to share one!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {ideas.map((idea) => (
        <IdeaCard key={idea._id} idea={idea} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default IdeaList;
