import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { toast } from 'react-toastify';
import { FiUser, FiEdit2 } from 'react-icons/fi';
import IdeaList from '../components/idea/IdeaList';
import Spinner from '../components/common/Spinner';
import axiosInstance from '../api/axiosInstance';
import useAuthStore from '../store/authStore';

const ProfilePage = () => {
  const { id } = useParams();
  const { user: currentUser, updateUser } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const isOwn = currentUser?._id === id;

  useEffect(() => {
    axiosInstance.get(`/users/${id}`)
      .then((res) => {
        setProfile(res.data.user);
        setIdeas(res.data.ideas);
      })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleProfileUpdate = async (values, { setSubmitting }) => {
    try {
      const res = await axiosInstance.put('/users/profile', values);
      setProfile(res.data);
      updateUser(res.data);
      setEditing(false);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="py-20"><Spinner /></div>;
  if (!profile) return <div className="text-center py-20 text-gray-400">User not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Profile card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold">
                {profile.name?.[0]?.toUpperCase() || <FiUser />}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{profile.name}</h1>
                {profile.department && <p className="text-sm text-indigo-600">{profile.department}</p>}
                {profile.bio && <p className="text-sm text-gray-500 mt-1 max-w-md">{profile.bio}</p>}
              </div>
            </div>
            {isOwn && !editing && (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <FiEdit2 size={13} /> Edit
              </button>
            )}
          </div>

          {/* Edit form */}
          {editing && (
            <Formik
              initialValues={{ name: profile.name || '', bio: profile.bio || '', department: profile.department || '' }}
              onSubmit={handleProfileUpdate}
            >
              {({ isSubmitting }) => (
                <Form className="mt-6 flex flex-col gap-4 border-t border-gray-100 pt-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                      <Field name="name" className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Department</label>
                      <Field name="department" placeholder="e.g. Computer Science" className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
                    <Field as="textarea" name="bio" rows={3} placeholder="Tell us about yourself..." className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none" />
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" disabled={isSubmitting} className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60">
                      {isSubmitting ? 'Saving...' : 'Save'}
                    </button>
                    <button type="button" onClick={() => setEditing(false)} className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                      Cancel
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </div>

        {/* Ideas */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {isOwn ? 'Your Ideas' : `Ideas by ${profile.name}`} ({ideas.length})
        </h2>
        <IdeaList ideas={ideas} loading={false} />
      </div>
    </div>
  );
};

export default ProfilePage;
