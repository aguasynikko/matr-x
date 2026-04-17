import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function AuthPage() {
  const { signUp, logIn } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (!username) {
          throw new Error('Username is required');
        }
        await signUp(email, password, username);
        setEmail('');
        setPassword('');
        setUsername('');
        setIsSignUp(false);
      } else {
        await logIn(email, password);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred';
      console.error('Auth error:', err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-dark-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-dark-card rounded-lg shadow-xl p-8 border border-dark-border">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-dark-text mb-2">Matr!x</h1>
            <p className="text-dark-text-tertiary">
              {isSignUp ? 'Create your account' : 'Welcome! Please log in.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  className="w-full px-4 py-2 bg-dark-input border border-dark-border rounded-lg text-dark-text placeholder-dark-text-tertiary focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-2 bg-dark-input border border-dark-border rounded-lg text-dark-text placeholder-dark-text-tertiary focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 bg-dark-input border border-dark-border rounded-lg text-dark-text placeholder-dark-text-tertiary focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-900/20 border border-red-700 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium rounded-lg transition duration-200"
            >
              {loading
                ? 'Loading...'
                : isSignUp
                ? 'Create Account'
                : 'Log In'}
            </button>
          </form>

          {/* Toggle Sign Up / Log In */}
          <div className="mt-6 text-center">
            <p className="text-dark-text-tertiary text-sm">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                  setEmail('');
                  setPassword('');
                  setUsername('');
                }}
                className="ml-2 text-blue-400 hover:text-blue-300 font-medium transition"
              >
                {isSignUp ? 'Log In' : 'Sign Up'}
              </button>
            </p>
          </div>

          {/* Confirmation Message */}
          {isSignUp && (
            <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700 rounded-lg text-blue-300 text-sm">
              A confirmation email will be sent to verify your account.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
