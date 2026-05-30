import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, BarChart, Zap, Search, ShieldCheck, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
            Optimize Your <span className="neon-text">Career</span> <br /> 
            with <span className="text-white">AI Intel</span>
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
            The most advanced AI-powered Resume Analyzer. Get ATS scores, skill gap analysis, and professional suggestions to land your dream job.
          </p>
          <div className="flex justify-center gap-6">
            <Link to="/register" className="btn-primary">Analyze Your Resume</Link>
            <button className="px-8 py-4 rounded-xl border border-white/20 hover:bg-white/5 transition-all">How it works</button>
          </div>
        </motion.div>
        
        {/* Animated Background Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full -z-10"></div>
      </section>

      {/* Features Section */}
      <section className="bg-white/5 py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">Precision <span className="neon-text">Features</span></h2>
            <p className="text-gray-400">Everything you need to beat the ATS and impress recruiters.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<BarChart className="text-primary" />}
              title="ATS Scoring"
              desc="Real-time ATS compatibility scoring based on industry standards and role-specific keywords."
            />
            <FeatureCard 
              icon={<Search className="text-primary" />}
              title="Skill Gap Detection"
              desc="Identify missing technical and soft skills required for your target job roles."
            />
            <FeatureCard 
              icon={<ShieldCheck className="text-primary" />}
              title="Fake Skill Detector"
              desc="Validate your claims with AI-generated mini-quizzes to boost recruiter trust."
            />
            <FeatureCard 
              icon={<Zap className="text-primary" />}
              title="Instant Extraction"
              desc="Our NLP engine extracts education, experience, and projects in seconds with high precision."
            />
            <FeatureCard 
              icon={<MessageSquare className="text-primary" />}
              title="AI Career Chat"
              desc="Get personalized career advice and resume improvement tips from our AI assistant."
            />
            <FeatureCard 
              icon={<CheckCircle className="text-primary" />}
              title="Section Analysis"
              desc="Detailed breakdown of your resume structure with suggestions for improvement."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="glass-card neon-border h-full"
  >
    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-4">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{desc}</p>
  </motion.div>
);

export default Home;
