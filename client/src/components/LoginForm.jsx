import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://192.168.100.7:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      localStorage.setItem('token', data.token);
      if (onLogin) onLogin(data.user);
      navigate('/'); // Redirect to home after login
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] bg-gradient-to-br from-gray-900 to-gray-800 dark:bg-gray-900">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white dark:bg-gray-900 dark:border-gray-700 dark:shadow-gray-900/40 rounded-xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">Login</h2>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded px-3 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded px-3 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Password"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded w-full font-semibold hover:bg-green-700 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <div className="text-red-400 mt-4 text-center">{error}</div>}
      </form>
    </div>
  );
}

export default LoginForm;
