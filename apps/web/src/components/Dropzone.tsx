'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileVolume2, FileVideo, ImageIcon } from 'lucide-react';
import axios from 'axios';

interface DropzoneProps {
  onUploadStarted: (jobId: string, fileName: string) => void;
}

export const Dropzone: React.FC<DropzoneProps> = ({ onUploadStarted }) => {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setIsUploading(true);
    const file = acceptedFiles[0];

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/upload', formData);
      onUploadStarted(response.data.jobId, file.name);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please check the console.');
    } finally {
      setIsUploading(false);
    }
  }, [onUploadStarted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxSize: 100 * 1024 * 1024, // 100MB limit for demo
  });

  return (
    <div className="w-full max-w-2xl mx-auto" {...getRootProps()}>
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-12 transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50/10' : 'border-zinc-700 bg-zinc-900/50'}
          hover:border-blue-400 hover:bg-zinc-800/80 backdrop-blur-xl group`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className={`p-4 rounded-full transition-colors ${isDragActive ? 'bg-blue-500 text-white' : 'bg-zinc-800 text-zinc-400 group-hover:text-blue-400'}`}>
            <Upload size={32} />
          </div>
          <div>
            <p className="text-xl font-medium text-white">
              {isDragActive ? 'Drop your file here' : 'Click or drag file to compress'}
            </p>
            <p className="text-zinc-500 mt-1">Video, Audio, or Images (Max 100MB)</p>
          </div>
        </div>

        {isUploading && (
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center space-y-3">
             <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
             <p className="text-white font-medium">Uploading...</p>
           </div>
        )}
      </motion.div>
    </div>
  );
};
