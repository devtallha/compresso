import { z } from 'zod';

export const JobStatus = z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED']);
export type JobStatus = z.infer<typeof JobStatus>;

export const FileType = z.enum(['VIDEO', 'AUDIO', 'IMAGE']);
export type FileType = z.infer<typeof FileType>;

export interface CompressionJob {
  id: string;
  originalName: string;
  outputPath?: string;
  status: JobStatus;
  progress: number;
  type: FileType;
  createdAt: Date;
  expiresAt: Date;
}

export const QueueEventSchema = z.object({
  jobId: z.string(),
  filePath: z.string(),
  fileType: FileType,
});

export type QueueEvent = z.infer<typeof QueueEventSchema>;
