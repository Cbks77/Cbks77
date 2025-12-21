import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useToast } from '../hooks/use-toast';

const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Simple password authentication
  const ADMIN_PASSWORD = 'cbks77admin2024';

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        localStorage.setItem('adminAuth', 'true');
        onLogin(true);
        toast({
          title: "Login Successful",
          description: "Welcome to CBKS77 Admin Dashboard",
        });
        navigate('/admin/dashboard');
      } else {
        toast({
          title: "Login Failed",
          description: "Incorrect password. Please try again.",
          variant: "destructive"
        });
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-white mb-2">
            CBKS<span className="text-red-500">77</span>
          </h1>
          <p className="text-gray-400">Admin Dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-8">
          <h2 className="text-white text-2xl font-bold mb-2">Login</h2>
          <p className="text-gray-400 mb-6">Enter your password to access the dashboard</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-white font-semibold mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-zinc-900 border-zinc-700 text-white h-12 text-lg"
                required
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-2">
                Default: cbks77admin2024
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold h-12 text-lg"
            >
              {loading ? 'Logging in...' : 'Login to Dashboard'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;