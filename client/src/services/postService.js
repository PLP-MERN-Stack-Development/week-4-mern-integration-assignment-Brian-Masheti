const API_URL = 'http://192.168.100.7:5000/api/posts';

// Get all posts with pagination, search, and filter
export async function getPosts(page = 1, limit = 10, search = '', category = '') {
  const params = new URLSearchParams();
  params.append('page', page);
  params.append('limit', limit);
  if (search) params.append('search', search);
  if (category) params.append('category', category);
  const response = await fetch(`${API_URL}?${params.toString()}`);
  if (!response.ok) throw new Error('Failed to fetch posts');
  return response.json();
}

// Get a single post by ID
export async function getPostById(id) {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error('Failed to fetch post');
  return response.json();
}

// Create a new post
export async function createPost(data) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create post');
  return response.json();
}

// Update a post
export async function updatePost(id, data) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update post');
  return response.json();
}

// Delete a post
export async function deletePost(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete post');
  return response.json();
}

// Like a post
function authHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function likePost(id) {
  const response = await fetch(`${API_URL}/${id}/like`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() }
  });
  if (!response.ok) throw new Error('Failed to like post');
  return response.json();
}

// Unlike a post
export async function unlikePost(id) {
  const response = await fetch(`${API_URL}/${id}/unlike`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() }
  });
  if (!response.ok) throw new Error('Failed to unlike post');
  return response.json();
}
