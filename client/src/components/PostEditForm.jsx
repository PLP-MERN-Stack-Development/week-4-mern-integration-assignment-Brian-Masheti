import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostById, updatePost } from '../services/postService';
import { getCategories } from '../services/categoryService';

function PostEditForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);  const [featuredImage, setFeaturedImage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      getPostById(id),
      getCategories()
    ])
      .then(([post, cats]) => {
        setTitle(post.title);
        setContent(post.content);
        setCategory(post.category?._id || '');
        setFeaturedImage(post.featuredImage || '');
        setCategories(cats);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load post or categories');
        setLoading(false);
      });
  }, [id]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch('http://192.168.100.7:5000/api/posts/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Image upload failed');
      setFeaturedImage(data.imageUrl);
    } catch (err) {
      setError('Image upload failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updatePost(id, { title, content, category, featuredImage });
      navigate(`/posts/${id}`);
    } catch {
      setError('Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading post...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-gray-900 text-gray-100 border border-gray-700 rounded-xl shadow-lg p-8 mt-8">
      <h2 className="text-xl font-bold mb-4">Edit Post</h2>
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="border border-gray-700 bg-gray-800 text-gray-100 rounded px-2 py-1 w-full mb-2"
        placeholder="Title"
        required
      />
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        className="border border-gray-700 bg-gray-800 text-gray-100 rounded px-2 py-1 w-full mb-2"
        placeholder="Content"
        required
      />
      <select
        value={category}
        onChange={e => setCategory(e.target.value)}
        className="border border-gray-700 bg-gray-900 text-gray-100 rounded px-2 py-1 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      >
        <option value="" className="bg-gray-900 text-gray-400">Select Category</option>
        {categories.map(cat => (
          <option key={cat._id} value={cat._id} className="bg-gray-900 text-gray-100">{cat.name}</option>
        ))}
      </select>
      <div className="mb-2">
        <label className="block mb-1 font-medium">Featured Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {featuredImage && (
          <img src={`http://192.168.100.7:5000${featuredImage}`} alt="Preview" className="mt-2 rounded max-h-40 border border-gray-700" />
        )}
      </div>
      <button
        type="submit"
        className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
        disabled={saving}
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
      {error && <div className="text-red-400 mt-1">{error}</div>}
    </form>
  );
}

export default PostEditForm;
