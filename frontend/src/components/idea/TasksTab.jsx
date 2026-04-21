import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiCalendar } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axiosInstance';
import useAuthStore from '../../store/authStore';

const STATUS_COLORS = {
  todo: 'bg-gray-100 text-gray-600',
  'in-progress': 'bg-yellow-100 text-yellow-700',
  done: 'bg-green-100 text-green-700',
};

const TasksTab = ({ idea }) => {
  const { user, isAuthenticated } = useAuthStore();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', assignedTo: '', deadline: '' });
  const [submitting, setSubmitting] = useState(false);

  const isOwner = isAuthenticated && user?._id === idea?.author?._id;
  const isMember = idea?.collaborators?.some((c) => (c._id || c) === user?._id);
  const isTeamOrOwner = isOwner || isMember;
  const teamMembers = [idea.author, ...(idea.collaborators || [])].filter(Boolean);

  useEffect(() => {
    if (!isTeamOrOwner) { setLoading(false); return; }
    axiosInstance
      .get(`/tasks/idea/${idea._id}`)
      .then((res) => setTasks(res.data))
      .catch(() => toast.error('Failed to load tasks'))
      .finally(() => setLoading(false));
  }, [idea._id, isTeamOrOwner]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Title is required');
    setSubmitting(true);
    try {
      const res = await axiosInstance.post(`/tasks/idea/${idea._id}`, {
        title: form.title,
        description: form.description,
        assignedTo: form.assignedTo || undefined,
        deadline: form.deadline || undefined,
      });
      setTasks((prev) => [res.data, ...prev]);
      setForm({ title: '', description: '', assignedTo: '', deadline: '' });
      setShowForm(false);
      toast.success('Task created!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      const res = await axiosInstance.patch(`/tasks/${taskId}`, { status });
      setTasks((prev) => prev.map((t) => (t._id === taskId ? res.data : t)));
    } catch {
      toast.error('Failed to update task');
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await axiosInstance.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    }
  };

  if (!isTeamOrOwner) {
    return <p className="text-sm text-gray-500">Tasks are only visible to team members.</p>;
  }

  if (loading) return <p className="text-sm text-gray-400">Loading tasks...</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Tasks ({tasks.length})</h3>
        {isOwner && (
          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <FiPlus size={12} /> Add Task
          </button>
        )}
      </div>

      {showForm && isOwner && (
        <form onSubmit={handleCreate} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50">
          <input
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            placeholder="Task title"
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
          <input
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            placeholder="Description (optional)"
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
          <div className="grid grid-cols-2 gap-3">
            <select
              value={form.assignedTo}
              onChange={(e) => setForm((p) => ({ ...p, assignedTo: e.target.value }))}
              className="px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="">Unassigned</option>
              {teamMembers.map((m) => (
                <option key={m._id} value={m._id}>{m.name}</option>
              ))}
            </select>
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => setForm((p) => ({ ...p, deadline: e.target.value }))}
              className="px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={submitting} className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-60 transition-colors">
              {submitting ? 'Creating...' : 'Create'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      {tasks.length === 0 ? (
        <p className="text-sm text-gray-400">No tasks yet.{isOwner && ' Add one to get started.'}</p>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <div key={task._id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-xl">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-gray-800">{task.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[task.status]}`}>{task.status}</span>
                </div>
                {task.description && <p className="text-xs text-gray-500 mt-0.5">{task.description}</p>}
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  {task.assignedTo && <span className="text-xs text-gray-400">Assigned: {task.assignedTo.name}</span>}
                  {task.deadline && (
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <FiCalendar size={10} /> {new Date(task.deadline).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task._id, e.target.value)}
                  className="text-xs px-2 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-400"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
                {isOwner && (
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FiTrash2 size={13} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TasksTab;
