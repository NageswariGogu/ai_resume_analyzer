import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="border-b border-white/10 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-primary rounded-lg group-hover:rotate-12 transition-transform">
            <Brain className="text-background" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight neon-text">CareerBoost AI</span>
        </Link>
        <div className="flex gap-8 items-center">
          <Link to="/" className="hover:text-primary transition-colors">Features</Link>
          {token ? (
            <>
              <Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
              <Link to="/upload" className="hover:text-primary transition-colors">Analyze</Link>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-primary transition-colors">Login</Link>
              <Link to="/register" className="btn-primary py-2 px-6">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
