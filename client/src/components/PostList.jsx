import React, { useEffect, useState, useRef } from 'react';
import { getPosts, deletePost, likePost, unlikePost } from '../services/postService';
import { getCategories } from '../services/categoryService';
import { Link } from 'react-router-dom';

function getUserFromToken() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return { id: payload.userId, username: payload.username };
  } catch {
    return null;
  }
}

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debounceTimeout = useRef(null);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [likingId, setLikingId] = useState(null);
  const user = getUserFromToken();
  const limit = 5;

  const fetchPosts = (pageNum = 1, searchVal = search, categoryVal = category) => {
    setLoading(true);
    getPosts(pageNum, limit, searchVal, categoryVal)
      .then(data => {
        setPosts(data.posts);
        setPage(data.page);
        setPages(data.pages);
        setTotal(data.total);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  // Debounce search input
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // 500ms debounce
    return () => clearTimeout(debounceTimeout.current);
  }, [search]);

  useEffect(() => {
    fetchPosts(page, debouncedSearch, category);
    // eslint-disable-next-line
  }, [page, debouncedSearch, category]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    setDeletingId(id);
    try {
      await deletePost(id);
      fetchPosts(page);
    } catch {
      setError('Failed to delete post');
    } finally {
      setDeletingId(null);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pages) {
      setPage(newPage);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-2">Posts</h2>
      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={handleSearchChange}
          className="px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring w-full md:w-1/2"
        />
        <select
          value={category}
          onChange={handleCategoryChange}
          className="px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring w-full md:w-1/4"
        >
          <option value="">All Categories</option>
          {categories.map((cat, i) => (
            <option key={cat._id || i} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>
      {posts.length === 0 ? (
        <div>No posts found.</div>
      ) : (
        <>
        <ul className="space-y-4">
          {posts.map((post, i) => (
            <li key={post._id || i} className="border border-gray-700 rounded-xl p-6 bg-gray-900 text-gray-100 shadow-lg flex flex-col gap-2">
              {post.featuredImage && (
                <img src={`http://192.168.100.7:5000${post.featuredImage}`} alt="Featured" className="mb-3 rounded max-h-60 w-full object-contain border border-gray-700 bg-gray-900" />
              )}
              <div className="flex items-center justify-between">
                <Link to={`/posts/${post._id}`} className="text-lg font-semibold text-blue-300 hover:underline">
                  {post.title}
                </Link>
                <span className="bg-blue-900 text-blue-200 text-xs font-medium px-2 py-1 rounded">
                  {post.category?.name || 'Uncategorized'}
                </span>
              </div>
              <div className="text-gray-200">{post.content}</div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-400">
                    {new Date(post.createdAt).toLocaleString()}
                  </span>
                  {user && post.likedBy && post.likedBy.includes(user.id) ? (
                    <button
                      onClick={async () => {
                        setLikingId(post._id);
                        try {
                          const res = await unlikePost(post._id);
                          setPosts(posts => posts.map(p => p._id === post._id ? { ...p, likeCount: res.likeCount, likedBy: res.likedBy } : p));
                        } catch {}
                        setLikingId(null);
                      }}
                      className="flex items-center gap-1 bg-gray-700 text-white px-2 py-1 rounded hover:bg-gray-800 text-xs disabled:opacity-50"
                      disabled={likingId === post._id}
                    >
                      <span role="img" aria-label="unlike">💔</span> Unlike ({post.likeCount})
                    </button>
                  ) : user ? (
                    <button
                      onClick={async () => {
                        setLikingId(post._id);
                        try {
                          const res = await likePost(post._id);
                          setPosts(posts => posts.map(p => p._id === post._id ? { ...p, likeCount: res.likeCount, likedBy: res.likedBy } : p));
                        } catch {}
                        setLikingId(null);
                      }}
                      className="flex items-center gap-1 bg-pink-700 text-white px-2 py-1 rounded hover:bg-pink-800 text-xs disabled:opacity-50"
                      disabled={likingId === post._id}
                    >
                      <span role="img" aria-label="like">❤️</span> Like ({post.likeCount})
                    </button>
                  ) : null}
                </div>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 text-xs disabled:opacity-50"
                  disabled={deletingId === post._id}
                >
                  {deletingId === post._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </li>
          ))}
        </ul>
        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50"
          >
            Previous
          </button>
          {pages > 0 &&
            Array.from({ length: pages }, (_, i) => (
              <button
                key={`page-btn-${i + 1}`}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}
              >
                {i + 1}
              </button>
            ))}
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === pages}
            className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="text-center text-xs text-gray-400 mt-2">
          Page {page} of {pages} | Total posts: {total}
        </div>
        </>
      )}
    </div>
  );
}

export default PostList;
