import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, AlertCircle, MessageSquare, Terminal, 
  Brain, Target, Lightbulb, ChevronRight, Send, Loader2
} from 'lucide-react';
import api from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const Analysis = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'bot', text: 'Hello! I am your CareerBoost AI. How can I help you improve your resume based on this analysis?' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: history } = await api.get('/resume/history');
        const resume = history.find(r => r._id === id);
        setData(resume);
      } catch (err) {
        console.error('Fetch error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg = { role: 'user', text: chatMessage };
    setChatHistory(prev => [...prev, userMsg]);
    setChatMessage('');
    setChatLoading(true);

    try {
      const { data: res } = await api.post('/advanced/chatbot', { message: chatMessage });
      setChatHistory(prev => [...prev, { role: 'bot', text: res.response }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'bot', text: 'Sorry, I am having trouble connecting right now.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-mono text-primary animate-pulse text-2xl uppercase tracking-widest">Initialising AI Analysis...</div>;
  if (!data) return <div className="text-center py-20 text-red-500">Analysis Not Found</div>;

  const scoreData = [
    { name: 'ATS Score', value: data.atsScore },
    { name: 'Remaining', value: 100 - data.atsScore }
  ];

  const radarData = Object.entries(data.jobMatch).map(([name, value]) => ({
    subject: name,
    A: value,
    fullMark: 100
  }));

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Metrics and Reports */}
        <div className="lg:w-2/3 space-y-8">
          
          <div className="flex justify-between items-start">
            <h1 className="text-4xl font-bold">Analysis <span className="neon-text">Report</span></h1>
            <div className="text-gray-500 text-sm uppercase tracking-widest font-mono">ID: {id.slice(-8)}</div>
          </div>

          {/* Score Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card flex flex-col items-center justify-center py-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Brain size={120} /></div>
                <div className="h-[200px] w-[200px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                            data={scoreData}
                            cx="50%" cy="50%"
                            innerRadius={70} outerRadius={90}
                            paddingAngle={5} dataKey="value"
                            startAngle={180} endAngle={-180}
                            >
                            <Cell fill="#00ff88" stroke="none" />
                            <Cell fill="#ffffff10" stroke="none" />
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-black text-primary">{data.atsScore}</span>
                        <span className="text-xs text-gray-500 uppercase tracking-widest">ATS Score</span>
                    </div>
                </div>
                <div className="mt-6 text-center">
                    <div className="text-lg font-bold mb-1">Impact Rating: {data.atsScore > 80 ? 'Excellent' : data.atsScore > 60 ? 'Strong' : 'Improvement Required'}</div>
                    <div className="text-sm text-gray-400">Based on industry algorithmic parsing patterns.</div>
                </div>
            </div>

            <div className="glass-card">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Target className="text-primary" /> Role Matching</h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#ffffff10" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Radar name="Match" dataKey="A" stroke="#00ff88" fill="#00ff88" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Skills and Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card">
              <h3 className="text-xl font-bold mb-6">Extracted Skills</h3>
              <div className="flex flex-wrap gap-3">
                {data.extractedSkills.map(skill => (
                  <span key={skill} className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm font-bold uppercase tracking-wider">{skill}</span>
                ))}
              </div>
              <h3 className="text-xl font-bold mt-10 mb-6 text-orange-400">Missing Key Skills</h3>
              <div className="flex flex-wrap gap-3">
                {data.missingSkills.map(skill => (
                  <span key={skill} className="px-4 py-2 bg-orange-400/5 text-orange-400 border border-orange-400/20 rounded-lg text-sm font-bold uppercase tracking-wider">{skill}</span>
                ))}
              </div>
            </div>

            <div className="glass-card">
              <h3 className="text-xl font-bold mb-6">Section Completeness</h3>
              <div className="space-y-4">
                {Object.entries(data.sections).map(([name, present]) => (
                  <div key={name} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <span className="font-medium text-gray-300">{name}</span>
                    {present ? <CheckCircle2 className="text-primary" size={20} /> : <AlertCircle className="text-red-500" size={20} />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Suggestions */}
          <div className="glass-card border-l-4 border-l-primary">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Lightbulb className="text-primary" /> AI Improvement Suggestions</h3>
            <div className="space-y-4">
              {data.suggestions.map((s, idx) => (
                <div key={idx} className="flex gap-4 items-start group">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary text-xs font-bold mt-0.5">{idx+1}</div>
                  <p className="text-gray-400 group-hover:text-white transition-colors">{s}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: AI Assistant */}
        <div className="lg:w-1/3">
          <div className="glass-card h-full flex flex-col border-primary/20 sticky top-24 max-h-[80vh]">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
              <div className="p-2 bg-primary rounded-lg shadow-[0_0_15px_rgba(0,255,136,0.5)]">
                <Terminal className="text-background" size={20} />
              </div>
              <h3 className="text-xl font-bold neon-text">AI Assistant</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-6 pr-4 custom-scrollbar">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                    ? 'bg-primary text-background font-bold shadow-lg' 
                    : 'bg-white/5 border border-white/10 text-gray-300'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {chatLoading && <div className="flex justify-start"><div className="bg-white/5 p-4 rounded-2xl animate-pulse text-primary font-mono select-none">CareerBoost is typing...</div></div>}
            </div>

            <form onSubmit={handleSendMessage} className="mt-8 relative">
              <input 
                type="text" 
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Ask for resume tips..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-4 pr-12 focus:border-primary outline-none text-sm transition-all"
              />
              <button 
                type="submit"
                disabled={chatLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:text-primary transition-colors disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analysis;
