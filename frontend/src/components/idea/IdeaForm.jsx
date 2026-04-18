import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const CATEGORIES = ['Tech', 'Business', 'Social', 'Science', 'Art', 'Other'];
const STATUSES = ['open', 'in-progress', 'completed'];

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required').min(5, 'At least 5 characters'),
  description: Yup.string().required('Description is required').min(20, 'At least 20 characters'),
  category: Yup.string().oneOf(CATEGORIES, 'Select a valid category').required('Category is required'),
  tags: Yup.string(),
  status: Yup.string().oneOf(STATUSES),
});

const IdeaForm = ({ initialValues, onSubmit, submitLabel = 'Submit Idea', showStatus = false }) => {
  const defaults = { title: '', description: '', category: '', tags: '', status: 'open', ...initialValues };

  const handleSubmit = (values, { setSubmitting }) => {
    const data = {
      ...values,
      tags: values.tags ? values.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    };
    onSubmit(data, setSubmitting);
  };

  return (
    <Formik initialValues={defaults} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <Form className="flex flex-col gap-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
            <Field
              name="title"
              type="text"
              placeholder="A catchy title for your idea"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
            <ErrorMessage name="title" component="p" className="text-red-500 text-xs mt-1" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <Field
              as="textarea"
              name="description"
              rows={5}
              placeholder="Describe your idea in detail..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm resize-none"
            />
            <ErrorMessage name="description" component="p" className="text-red-500 text-xs mt-1" />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
            <Field
              as="select"
              name="category"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Field>
            <ErrorMessage name="category" component="p" className="text-red-500 text-xs mt-1" />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tags <span className="text-gray-400 font-normal">(comma-separated)</span>
            </label>
            <Field
              name="tags"
              type="text"
              placeholder="e.g. AI, sustainability, mobile"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Status (edit mode only) */}
          {showStatus && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
              <Field
                as="select"
                name="status"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}</option>
                ))}
              </Field>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm disabled:opacity-60"
          >
            {isSubmitting ? 'Saving...' : submitLabel}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default IdeaForm;
