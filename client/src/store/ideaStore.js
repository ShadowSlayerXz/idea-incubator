import { create } from 'zustand';

const useIdeaStore = create((set) => ({
  ideas: [],
  selectedIdea: null,
  loading: false,
  error: null,
  pagination: { total: 0, page: 1, pages: 1 },
  filters: { category: '', search: '', tags: '', page: 1 },

  setIdeas: (ideas, pagination) => set({ ideas, pagination }),
  setSelectedIdea: (idea) => set({ selectedIdea: idea }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  clearFilters: () => set({ filters: { category: '', search: '', tags: '', page: 1 } }),
}));

export default useIdeaStore;
