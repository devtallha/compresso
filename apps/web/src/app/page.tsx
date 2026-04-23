'use client';

import React, { useState } from 'react';
import { Dropzone } from '@/components/Dropzone';
import { JobList } from '@/components/JobList';
import { motion } from 'framer-motion';

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
      <footer className="relative z-10 py-12 text-center border-t border-zinc-900 mt-20">
        <p className="text-zinc-500 text-sm">
          Built with Turborepo, Next.js, and RabbitMQ. 
          <span className="ml-2 px-2 py-1 rounded bg-zinc-800 text-zinc-400">Open Source</span>
        </p>
      </footer>
    </main>
  );
}
