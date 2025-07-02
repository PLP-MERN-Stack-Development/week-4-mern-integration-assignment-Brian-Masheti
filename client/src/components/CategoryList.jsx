import React, { useEffect, useState } from 'react';
import { getCategories, deleteCategory, updateCategory } from '../services/categoryService';

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [savingId, setSavingId] = useState(null);

  const fetchCategories = () => {
    setLoading(true);
    getCategories()
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    setDeletingId(id);
    try {
      await deleteCategory(id);
      fetchCategories();
    } catch {
      setError('Failed to delete category');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (id, name) => {
    setEditingId(id);
    setEditName(name);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditName('');
  };

  const handleEditSave = async (id) => {
    if (!editName.trim()) return;
    setSavingId(id);
    try {
      await updateCategory(id, { name: editName });
      fetchCategories();
      setEditingId(null);
      setEditName('');
    } catch {
      setError('Failed to update category');
    } finally {
      setSavingId(null);
    }
  };

  if (loading) return <div>Loading categories...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Categories</h2>
      <ul className="space-y-2">
        {categories.map(cat => (
          <li key={cat._id} className="flex items-center justify-between bg-gray-900 text-gray-100 border border-gray-700 rounded-xl shadow-lg px-6 py-4">
            {editingId === cat._id ? (
              <>
                <input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="border border-gray-700 bg-gray-800 text-gray-100 rounded px-2 py-1 mr-2"
                  disabled={savingId === cat._id}
                  autoFocus
                />
                <button
                  onClick={() => handleEditSave(cat._id)}
                  className="p-1 rounded hover:bg-green-900 focus:bg-green-800 mr-1"
                  disabled={savingId === cat._id}
                  title="Save"
                >
                  <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button
                  onClick={handleEditCancel}
                  className="p-1 rounded hover:bg-gray-800 focus:bg-gray-700"
                  title="Cancel"
                >
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </>
            ) : (
              <>
                <span className="font-medium text-gray-100">{cat.name}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(cat._id, cat.name)}
                    className="p-1 rounded hover:bg-yellow-900 focus:bg-yellow-800"
                    title="Edit category"
                  >
                    <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m2-2l-6 6" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="p-1 rounded hover:bg-red-900 focus:bg-red-800 disabled:opacity-50"
                    disabled={deletingId === cat._id}
                    title="Delete category"
                  >
                    {deletingId === cat._id ? (
                      <svg className="animate-spin h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M10 3h4a1 1 0 011 1v2H9V4a1 1 0 011-1z" />
                      </svg>
                    )}
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryList;
