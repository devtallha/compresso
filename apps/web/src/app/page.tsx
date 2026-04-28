'use client';

import React, { useState } from 'react';
import { Dropzone } from '@/components/Dropzone';
import { JobList } from '@/components/JobList';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

const GithubIcon = ({ size = 24, ...props }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.03c3.15-.38 6.5-1.4 6.5-7.17A5.8 5.8 0 0 0 19 4.92a5.9 5.9 0 0 0-.2-3.82s-1.5-.5-5 1.8a17.4 17.4 0 0 0-9 0C1.3 1 0 1 0 1a5.9 5.9 0 0 0-.2 3.82 5.8 5.8 0 0 0-1.5 2.88c0 5.76 3.34 6.78 6.5 7.16A4.8 4.8 0 0 0 4 18v4" />
  </svg>
);

const LinkedinIcon = ({ size = 24, ...props }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function Home() {
  const [jobs, setJobs] = useState<any[]>([]);

  const handleUploadStarted = (jobId: string, fileName: string) => {
    setJobs((prev) => [
      {
        id: jobId,
        name: fileName,
        status: 'PENDING',
        progress: 0,
      },
      ...prev,
    ]);
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-blue-500/30 overflow-hidden">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-12">
        {/* Header */}
        <div className="text-center space-y-4 mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40"
          >
            Compresso
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto"
          >
            High-performance, secure, and cost-free media compression.
            No cloud storage. No data leaks. Just speed.
          </motion.p>
        </div>

        {/* Dropzone Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Dropzone onUploadStarted={handleUploadStarted} />
        </motion.div>

        {/* List Section */}
        <JobList jobs={jobs} setJobs={setJobs} />
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-12 text-center border-t border-zinc-900 mt-20 flex flex-col items-center justify-center">
        <p className="text-zinc-500 text-sm mb-6">
          Built with Turborepo, Next.js, and RabbitMQ.
          <span className="ml-2 px-2 py-1 rounded bg-zinc-800 text-zinc-400">Open Source</span>
        </p>

        <div className="flex items-center justify-center space-x-6 text-zinc-400">
          <a href="https://github.com/devtallha" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" title="GitHub">
            <span className="sr-only">GitHub</span>
            <GithubIcon size={20} />
          </a>
          <a href="https://linkedin.com/in/devtallha" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" title="LinkedIn">
            <span className="sr-only">LinkedIn</span>
            <LinkedinIcon size={20} />
          </a>
          <a href="https://devtallha.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" title="Portfolio">
            <span className="sr-only">Portfolio</span>
            <Globe size={20} />
          </a>
        </div>

        <p className="mt-6 text-xs text-zinc-600">
          Designed and built by Tallha Mushtaq (@devtallha)
        </p>
      </footer>
    </main>
  );
}
