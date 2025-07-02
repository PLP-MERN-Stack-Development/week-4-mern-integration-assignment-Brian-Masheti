import React, { useState } from 'react';
import { createCategory } from '../services/categoryService';

function CategoryForm({ onCategoryCreated }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createCategory({ name });
      setName('');
      if (onCategoryCreated) onCategoryCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <label className="block mb-1 font-medium">New Category</label>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        className="border rounded px-2 py-1 mr-2"
        placeholder="Category name"
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Category'}
      </button>
      {error && <div className="text-red-600 mt-1">{error}</div>}
    </form>
  );
}

export default CategoryForm;
