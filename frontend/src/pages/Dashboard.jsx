import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Award, Clock, ArrowRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const Dashboard = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get('/resume/history');
        setHistory(data);
      } catch (err) {
        console.error('Failed to fetch history', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const chartData = history.map(item => ({
    date: new Date(item.createdAt).toLocaleDateString(),
    score: item.atsScore
  })).reverse();

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, <span className="neon-text uppercase tracking-wider">{user?.name}</span></h1>
          <p className="text-gray-400">Track your resume progress and ATS performance.</p>
        </div>
        <Link to="/upload" className="btn-primary">New Analysis</Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <StatCard icon={<BarChart3 />} label="Average Score" value={history.length ? Math.round(history.reduce((a, b) => a + b.atsScore, 0) / history.length) : 0} />
        <StatCard icon={<TrendingUp />} label="Analyses" value={history.length} />
        <StatCard icon={<Award />} label="Top Score" value={history.length ? Math.max(...history.map(h => h.atsScore)) : 0} />
        <StatCard icon={<Clock />} label="Last Activity" value={history.length ? new Date(history[0].createdAt).toLocaleDateString() : 'N/A'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trend Chart */}
        <div className="lg:col-span-2 glass-card">
          <h3 className="text-xl font-bold mb-8">ATS Score Trend</h3>
          <div className="h-[300px]">
            {history.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#07120c', border: '1px solid #ffffff20' }}
                    itemStyle={{ color: '#00ff88' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#00ff88" fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 italic">No data yet. Upload your first resume to see trends!</div>
            )}
          </div>
        </div>

        {/* Recent History */}
        <div className="glass-card">
          <h3 className="text-xl font-bold mb-8">Recent Analyses</h3>
          <div className="space-y-6">
            {history.slice(0, 5).map((item, idx) => (
              <Link 
                to={`/analysis/${item._id}`} 
                key={idx}
                className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-primary/50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="font-medium group-hover:text-primary transition-colors">Resume #{history.length - idx}</p>
                    <p className="text-sm text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">{item.atsScore}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest">ATS Score</div>
                </div>
              </Link>
            ))}
            {history.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-white/10 rounded-2xl bg-white/5">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <FileText className="text-primary" size={32} />
                </div>
                <h4 className="text-lg font-bold mb-2">No resumes analyzed yet</h4>
                <p className="text-gray-400 text-sm mb-6 max-w-[200px] mx-auto">Upload your first resume to get an AI-powered ATS score.</p>
                <Link to="/upload" className="btn-primary py-2 px-8 text-sm">Upload Now</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="glass-card flex items-center gap-4 border-l-4 border-l-primary">
    <div className="p-3 bg-primary/10 rounded-xl text-primary">
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <div>
      <p className="text-sm text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

export default Dashboard;
