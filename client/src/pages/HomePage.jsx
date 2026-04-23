import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import IdeaList from '../components/idea/IdeaList';
import SearchBar from '../components/common/SearchBar';
import useIdeas from '../hooks/useIdeas';
import useIdeaStore from '../store/ideaStore';
import useAuthStore from '../store/authStore';

const CATEGORIES = ['All', 'Tech', 'Business', 'Social', 'Science', 'Art', 'Other'];

const HomePage = () => {
  const { fetchIdeas } = useIdeas();
  const { ideas, loading, filters, setFilters, pagination } = useIdeaStore();
  const { isAuthenticated } = useAuthStore();
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    fetchIdeas(filters);
  }, [filters]);

  const handleSearch = (search) => setFilters({ search, page: 1 });

  const handleCategory = (cat) => {
    setActiveCategory(cat);
    setFilters({ category: cat === 'All' ? '' : cat, page: 1 });
  };

  const handlePage = (page) => {
    setFilters({ page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
          <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full mb-4">
            For college innovators
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Where great ideas
            <br />
            <span className="text-indigo-600">find collaborators</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8">
            Submit your research or startup ideas, discover others' work, and connect with teammates who share your vision.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {isAuthenticated ? (
              <Link
                to="/ideas/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
              >
                Submit an Idea <FiArrowRight />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                >
                  Get Started <FiArrowRight />
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Browse */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {isAuthenticated ? (
          <>
            {/* Search + heading */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Browse Ideas</h2>
              <SearchBar onSearch={handleSearch} />
            </div>

            {/* Category filter */}
            <div className="flex flex-wrap gap-2 mb-8">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === cat
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-600 hover:border-indigo-400 hover:text-indigo-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <IdeaList ideas={ideas} loading={loading} />

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => handlePage(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <FiChevronLeft size={16} />
                </button>

                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePage(p)}
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                      p === pagination.page
                        ? 'bg-indigo-600 text-white'
                        : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => handlePage(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages}
                  className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
              <FiArrowRight size={24} className="text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Sign in to browse ideas</h3>
            <p className="text-gray-500 text-sm mb-6 max-w-sm">
              Create an account or sign in to explore research and startup ideas from your peers.
            </p>
            <div className="flex gap-3">
              <Link
                to="/register"
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
