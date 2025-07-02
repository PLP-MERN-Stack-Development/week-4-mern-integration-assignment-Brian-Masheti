const API_URL = 'http://192.168.100.7:5000/api/comments';

// Get all comments for a post
export async function getCommentsByPost(postId) {
  const response = await fetch(`${API_URL}/post/${postId}`);
  if (!response.ok) throw new Error('Failed to fetch comments');
  return response.json();
}

function authHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Add a new comment to a post
export async function addComment(postId, data) {
  const response = await fetch(`${API_URL}/post/${postId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to add comment');
  return response.json();
}

// Delete a comment
export async function deleteComment(commentId) {
  const response = await fetch(`${API_URL}/${commentId}`, {
    method: 'DELETE',
    headers: { ...authHeader() },
  });
  if (!response.ok) throw new Error('Failed to delete comment');
  return response.json();
}
