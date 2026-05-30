import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Upload as UploadIcon, FileText, Loader2, CheckCircle, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
    setError('');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false
  });

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await api.post('/resume/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
      });
      navigate(`/analysis/${data.resume_id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-20 max-w-4xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">Analyze Your <span className="neon-text">Resume</span></h1>
        <p className="text-gray-400">Upload your PDF or DOCX file to get instant AI feedback and ATS score.</p>
      </motion.div>

      <div 
        {...getRootProps()} 
        className={`glass-card border-2 border-dashed transition-all cursor-pointer py-20 text-center
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-white/10 hover:border-primary/50'}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <UploadIcon className="text-primary" size={32} />
          </div>
          {file ? (
            <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
              <FileText className="text-primary" />
              <span className="font-medium">{file.name}</span>
            </div>
          ) : (
            <>
              <p className="text-xl font-bold mb-2">Drag & Drop Resume</p>
              <p className="text-gray-400">or click to browse files</p>
            </>
          )}
        </div>
      </div>

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

      <div className="mt-12 flex justify-center">
        <button 
          onClick={handleUpload}
          disabled={!file || uploading}
          className={`btn-primary px-12 py-4 flex items-center gap-3 ${(!file || uploading) && 'opacity-50 cursor-not-allowed uppercase'}`}
        >
          {uploading ? (
            <>
              <Loader2 className="animate-spin" />
              <span>Analyzing {progress}%</span>
            </>
          ) : (
            <>
              <Zap size={20} />
              <span>Generate Analysis</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Upload;
