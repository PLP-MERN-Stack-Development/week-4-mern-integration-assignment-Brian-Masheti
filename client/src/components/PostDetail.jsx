import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPostById, deletePost, likePost, unlikePost } from '../services/postService';
import { getCommentsByPost, addComment, deleteComment } from '../services/commentService';

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

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [liking, setLiking] = useState(false);
  const user = getUserFromToken();
  const [showImageModal, setShowImageModal] = useState(false);

  // Comments state
  const [comments, setComments] = useState([]);
  const [commentLoading, setCommentLoading] = useState(true);
  const [commentError, setCommentError] = useState(null);
  const [commentContent, setCommentContent] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null);

  useEffect(() => {
    getPostById(id)
      .then(data => {
        setPost(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  // Fetch comments
  useEffect(() => {
    setCommentLoading(true);
    getCommentsByPost(id)
      .then(data => {
        setComments(data);
        setCommentLoading(false);
      })
      .catch(error => {
        setCommentError(error.message);
        setCommentLoading(false);
      });
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentAuthor.trim() || !commentContent.trim()) return;
    setAddingComment(true);
    try {
      await addComment(id, { author: commentAuthor, content: commentContent });
      setCommentContent('');
      setCommentAuthor('');
      // Refresh comments
      const data = await getCommentsByPost(id);
      setComments(data);
    } catch {
      setCommentError('Failed to add comment');
    } finally {
      setAddingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    setDeletingCommentId(commentId);
    try {
      await deleteComment(commentId);
      setComments(comments.filter(c => c._id !== commentId));
    } catch {
      setCommentError('Failed to delete comment');
    } finally {
      setDeletingCommentId(null);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    setDeleting(true);
    try {
      await deletePost(id);
      navigate('/posts');
    } catch {
      setError('Failed to delete post');
      setDeleting(false);
    }
  };

  if (loading) return <div>Loading post...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!post) return <div>Post not found.</div>;

  return (
    <div className="max-w-2xl mx-auto bg-gray-900 text-gray-100 border border-gray-700 rounded-xl shadow-lg p-8 mt-8">
      <Link to="/posts" className="text-blue-400 hover:underline text-sm">&larr; Back to Posts</Link>
      {post.featuredImage && (
        <>
          <img
            src={`http://192.168.100.7:5000${post.featuredImage}`}
            alt="Featured"
            className="mb-4 rounded max-h-80 w-full object-contain border border-gray-700 bg-gray-900 cursor-pointer"
            onClick={() => setShowImageModal(true)}
          />
          {showImageModal && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
              onClick={() => setShowImageModal(false)}
            >
              <div
                className="relative"
                onClick={e => e.stopPropagation()}
              >
                <button
                  className="absolute top-2 right-2 bg-gray-900 bg-opacity-80 text-white rounded-full px-3 py-1 text-lg z-10 hover:bg-red-700"
                  onClick={() => setShowImageModal(false)}
                  aria-label="Close"
                >
                  ×
                </button>
                <img
                  src={`http://192.168.100.7:5000${post.featuredImage}`}
                  alt="Featured Large"
                  className="max-h-[80vh] max-w-[90vw] rounded shadow-lg"
                />
              </div>
            </div>
          )}
        </>
      )}
      <h2 className="text-2xl font-bold mb-2 mt-2 text-gray-100">{post.title}</h2>
      <div className="mb-4 text-gray-200">{post.content}</div>
      <div className="mb-2">
        <span className="bg-blue-900 text-blue-200 text-xs font-medium px-2 py-1 rounded">
          {post.category?.name || 'Uncategorized'}
        </span>
      </div>
      <div className="text-xs text-gray-400 mb-4">Created: {new Date(post.createdAt).toLocaleString()}</div>
      <div className="flex gap-2 mb-6 items-center">
        <Link
          to={`/posts/${id}/edit`}
          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
        >
          Edit
        </Link>
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm disabled:opacity-50"
          disabled={deleting}
        >
          {deleting ? 'Deleting...' : 'Delete Post'}
        </button>
        {/* Like/Unlike Button */}
        {user && post.likedBy && post.likedBy.includes(user.id) ? (
          <button
            onClick={async () => {
              setLiking(true);
              try {
                const res = await unlikePost(post._id);
                setPost(p => ({ ...p, likeCount: res.likeCount, likedBy: res.likedBy }));
              } catch {}
              setLiking(false);
            }}
            className="flex items-center gap-1 bg-gray-700 text-white px-2 py-1 rounded hover:bg-gray-800 text-xs disabled:opacity-50"
            disabled={liking}
          >
            <span role="img" aria-label="unlike">💔</span> Unlike ({post.likeCount})
          </button>
        ) : user ? (
          <button
            onClick={async () => {
              setLiking(true);
              try {
                const res = await likePost(post._id);
                setPost(p => ({ ...p, likeCount: res.likeCount, likedBy: res.likedBy }));
              } catch {}
              setLiking(false);
            }}
            className="flex items-center gap-1 bg-pink-700 text-white px-2 py-1 rounded hover:bg-pink-800 text-xs disabled:opacity-50"
            disabled={liking}
          >
            <span role="img" aria-label="like">❤️</span> Like ({post.likeCount})
          </button>
        ) : null}
      </div>

      {/* Comments Section */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Comments</h3>
        {commentLoading ? (
          <div>Loading comments...</div>
        ) : commentError ? (
          <div className="text-red-400">{commentError}</div>
        ) : (
          <>
            {comments.length === 0 ? (
              <div className="text-gray-400">No comments yet.</div>
            ) : (
              <ul className="space-y-3 mb-4">
                {comments.map(comment => (
                  <li key={comment._id} className="bg-gray-800 border border-gray-700 rounded p-3 flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-blue-300 text-sm">{comment.author}</div>
                      <div className="text-gray-200 text-sm">{comment.content}</div>
                      <div className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</div>
                    </div>
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="ml-4 bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 disabled:opacity-50"
                      disabled={deletingCommentId === comment._id}
                    >
                      {deletingCommentId === comment._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {/* Add Comment Form */}
            {user ? (
              <form onSubmit={handleAddComment} className="flex flex-col gap-2 mt-2">
                <textarea
                  placeholder="Add a comment..."
                  value={commentContent}
                  onChange={e => setCommentContent(e.target.value)}
                  className="px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                  disabled={addingComment}
                >
                  {addingComment ? 'Adding...' : 'Add Comment'}
                </button>
              </form>
            ) : (
              <div className="text-gray-400 mt-2">Login to add a comment.</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default PostDetail;
