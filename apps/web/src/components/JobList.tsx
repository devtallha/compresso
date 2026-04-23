'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Loader2, Download, Trash2, X } from 'lucide-react';
import axios from 'axios';

interface Job {
  id: string;
  name: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  progress: number;
}

export const JobList: React.FC<{ jobs: Job[]; setJobs: React.Dispatch<React.SetStateAction<Job[]>> }> = ({ jobs, setJobs }) => {
  
  useEffect(() => {
    const interval = setInterval(async () => {
      const activeJobs = jobs.filter(j => j.status === 'PENDING' || j.status === 'PROCESSING');
      if (activeJobs.length === 0) return;

      for (const job of activeJobs) {
        try {
          const res = await axios.get(`/api/status/${job.id}`);
          if (res.data.status !== job.status || res.data.progress !== job.progress) {
             setJobs(prev => prev.map(p => p.id === job.id ? { ...p, status: res.data.status, progress: res.data.progress } : p));
          }
        } catch (error) {
          console.error('Failed to fetch status for:', job.id);
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [jobs, setJobs]);

  const removeJob = (id: string) => {
    setJobs(prev => prev.filter(j => j.id !== id));
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 space-y-4">
      <AnimatePresence mode="popLayout">
        {jobs.map((job) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 backdrop-blur-md"
          >
            <div className="flex flex-col flex-1">
              <div className="flex items-center space-x-3">
                <p className="text-sm font-medium text-white truncate max-w-[200px]">{job.name}</p>
                <div className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-400">
                  {job.status}
                </div>
              </div>
              
              {(job.status === 'PENDING' || job.status === 'PROCESSING') && (
                <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-3 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${job.progress}%` }}
                    className="bg-blue-500 h-full"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 ml-4">
              {job.status === 'COMPLETED' && (
                <a
                  href={`/api/download/${job.id}`}
                  className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white transition-colors"
                  title="Download"
                >
                  <Download size={18} />
                </a>
              )}
              <button
                onClick={() => removeJob(job.id)}
                className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                title="Remove"
              >
                <X size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
