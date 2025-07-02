import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CategoryForm from './components/CategoryForm';
import CategoryList from './components/CategoryList';
import PostForm from './components/PostForm';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import PostEditForm from './components/PostEditForm';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';

function Home({ user }) {
  const [refreshCategories, setRefreshCategories] = useState(false);
  const [refreshPosts, setRefreshPosts] = useState(false);

  const handleCategoryCreated = () => setRefreshCategories(r => !r);
  const handlePostCreated = () => setRefreshPosts(r => !r);

  return (
    <div>
      {user && <CategoryForm onCategoryCreated={handleCategoryCreated} />}
      <CategoryList key={refreshCategories} />
      <div className="my-8 border-t border-gray-300" />
      {user ? (
        <PostForm onPostCreated={handlePostCreated} />
      ) : (
        <div className="mb-4 text-center text-gray-600">Login to create a post.</div>
      )}
      <PostList key={refreshPosts} />
    </div>
  );
}

function App() {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      // Decode JWT payload (not secure, just for display)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return { username: payload.username };
    } catch {
      return null;
    }
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 dark:bg-gray-900 text-gray-100 p-6">
        <nav className="sticky top-0 z-50 bg-gray-900 bg-opacity-95 mb-6 flex justify-between items-center border-b border-gray-700 pb-2">
          <div className="flex gap-4">
            {user && <Link to="/" className="text-blue-400 hover:underline font-semibold">Home</Link>}
            {user && <Link to="/categories" className="text-blue-400 hover:underline font-semibold">Categories</Link>}
            {user && <Link to="/posts" className="text-blue-400 hover:underline font-semibold">Posts</Link>}
          </div>
          <div className="flex gap-4 items-center">
            {!user && <Link to="/register" className="text-blue-400 hover:underline font-semibold">Register</Link>}
            {!user && <Link to="/login" className="text-blue-400 hover:underline font-semibold">Login</Link>}
            {user && (
              <>
                <span className="text-gray-200">Logged in as <b>{user.username}</b></span>
                <button onClick={handleLogout} className="bg-gray-800 px-2 py-1 rounded text-sm hover:bg-gray-700 border border-gray-700 ml-2">Logout</button>
              </>
            )}
          </div>
        </nav>
        <Routes>
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm onLogin={setUser} />} />
          <Route path="/" element={user ? <Home user={user} /> : <LoginForm onLogin={setUser} />} />
          <Route path="/categories" element={user ? (
            <div>
              <CategoryForm onCategoryCreated={() => {}} />
              <CategoryList />
            </div>
          ) : <LoginForm onLogin={setUser} />} />
          <Route path="/posts" element={user ? (
            <div>
              <PostForm onPostCreated={() => {}} />
              <PostList />
            </div>
          ) : <LoginForm onLogin={setUser} />} />
          <Route path="/posts/:id" element={user ? <PostDetail /> : <LoginForm onLogin={setUser} />} />
          <Route path="/posts/:id/edit" element={user ? <PostEditForm /> : <div className="text-center mt-8">Login to edit posts.</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
