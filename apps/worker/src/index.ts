import * as amqp from 'amqplib';
import path from 'path';
import fs from 'fs';
import { db } from '@compresso/database';
import { CompressorFactory } from '@compresso/domain';
import { QueueEventSchema } from '@compresso/shared';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://user:password@localhost';
const COMPRESSED_DIR = path.join(process.cwd(), 'data/uploads/compressed');

if (!fs.existsSync(COMPRESSED_DIR)) {
  fs.mkdirSync(COMPRESSED_DIR, { recursive: true });
}

async function startWorker() {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  
  const queues = ['image_priority_queue', 'video_standard_queue'];

  for (const queue of queues) {
    await channel.assertQueue(queue, { durable: true });
    
    // Set prefetch: 5 for images (they are fast), 1 for videos (CPU heavy)
    const prefetch = queue.includes('image') ? 5 : 1;
    // Note: channel-level prefetch applies to all consumers if not careful, 
    // but we can set it per consumer in some setups. 
    // Simplified for now:
    channel.prefetch(prefetch);

    console.log(`[*] Worker listening for messages in ${queue} (prefetch: ${prefetch})`);

    channel.consume(queue, async (msg) => {
      if (!msg) return;

      try {
        const content = JSON.parse(msg.content.toString());
        const { jobId, filePath, fileType } = QueueEventSchema.parse(content);

        console.log(`[x] Processing Job: ${jobId} from ${queue}`);

        // 1. Update status to PROCESSING
        await db.job.update({
          where: { id: jobId },
          data: { status: 'PROCESSING' },
        });

        await redis.set(`job:status:${jobId}`, 'PROCESSING', 'EX', 3600);
        await redis.set(`job:progress:${jobId}`, 0, 'EX', 3600);

        // 2. Get Compressor
        const compressor = CompressorFactory.getCompressor(fileType.toLowerCase());
        const outputPath = path.join(COMPRESSED_DIR, `${jobId}-compressed-${path.basename(filePath)}`);

        // 3. Compress
        await compressor.compress(filePath, outputPath);

        // 4. Update status to COMPLETED
        await db.job.update({
          where: { id: jobId },
          data: { 
            status: 'COMPLETED',
            outputPath,
            progress: 100
          },
        });
        
        await redis.set(`job:status:${jobId}`, 'COMPLETED', 'EX', 3600);
        await redis.set(`job:progress:${jobId}`, 100, 'EX', 3600);

        console.log(`[v] Job ${jobId} Completed`);
        channel.ack(msg);
      } catch (error) {
        console.error('[!] Worker Error:', error);
        channel.nack(msg, false, true); 
      }
    });
  }

  // --- Janitor Service (Cleanup) ---
  setInterval(async () => {
    console.log('[Janitor] Starting cleanup duty...');
    try {
      const expiredJobs = await db.job.findMany({
        where: {
          expiresAt: { lt: new Date() }
        }
      });

      for (const job of expiredJobs) {
        // Delete files
        if (job.filePath && fs.existsSync(job.filePath)) {
          fs.unlinkSync(job.filePath);
        }
        if (job.outputPath && fs.existsSync(job.outputPath)) {
          fs.unlinkSync(job.outputPath);
        }
        
        // Delete from DB (or mark as expired)
        await db.job.delete({ where: { id: job.id } });
        console.log(`[Janitor] Purged job ${job.id}`);
      }
    } catch (error) {
      console.error('[Janitor] Error during cleanup:', error);
    }
  }, 15 * 60 * 1000); // Run every 15 minutes
}

startWorker().catch(console.error);
