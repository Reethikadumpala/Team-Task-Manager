import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!email || !password) {
      setIsSubmitting(false);
      return setError('Please fill in all fields');
    }

    try {
      await login(email, password);
    } catch (err) {
      setError(err.toString());
      console.error('Login form error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md p-10 glass-card rounded-[2.5rem] shadow-2xl fade-in relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-blue-500"></div>
      <div className="flex justify-center mb-6">
        <div className="p-3 bg-primary-600/20 rounded-xl">
          <LogIn className="w-8 h-8 text-primary-500" />
        </div>
      </div>
      <h2 className="text-4xl font-bold text-center mb-2 tracking-tight text-gradient">Welcome Back</h2>
      <p className="text-slate-400 text-center mb-10 font-medium">Manage your team tasks effortlessly</p>

      {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
          <input 
            type="email" 
            className="input-field" 
            placeholder="name@company.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Password</label>
          <input 
            type="password" 
            className="input-field" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button 
          type="submit" 
          className={`w-full btn-primary py-3 flex justify-center items-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-slate-400 text-sm">
        Don't have an account?{' '}
        <Link to="/signup" className="text-primary-400 hover:text-primary-300 font-semibold">Sign up</Link>
      </p>
    </div>
  );
}
