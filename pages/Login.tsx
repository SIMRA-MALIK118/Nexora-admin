
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Loader2, ArrowRight } from 'lucide-react';
import { AppRoute } from '../types';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      if (username === 'admin' && password === 'password123') {
        localStorage.setItem('ca_admin_token', 'authenticated_session_true');
        navigate(AppRoute.DASHBOARD);
      } else {
        setError('Invalid username or password. Please try again.');
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          {/* <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl mb-4 shadow-xl">
  <img 
    src="../assets/dark-logo.png"
    alt="Code Axis Logo"
    className="w-10 h-10 object-contain"
  />
</div> */}

          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Welcome Back</h1>
          <p className="text-gray-500 mt-2 font-medium">Log in to manage your agency portal</p>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-semibold border border-red-100 animate-shake">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Username</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  required
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all font-medium"
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  required
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              disabled={isLoading}
              type="submit"
              className="w-full bg-[#0d0d0d] text-white py-4 rounded-xl font-bold hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 active:scale-95"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400 font-medium px-4">
              Authorized personnel only. All access attempts are monitored and recorded.
            </p>
          </div>
        </div>

        {/* <p className="text-center mt-8 text-sm text-gray-400">
          Default Creds: <span className="text-gray-600 font-mono">admin / password123</span>
        </p> */}
      </div>
    </div>
  );
};

export default Login;
