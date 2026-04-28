import { NextRequest, NextResponse } from 'next/server';
import { db } from '@compresso/database';
import { RabbitMQProvider, LocalFileStore } from '@compresso/infra';
import path from 'path';
import Busboy from 'busboy';
import { Readable } from 'stream';

const UPLOAD_DIR = path.join(process.cwd(), 'data/uploads/raw');
const fileStore = new LocalFileStore(UPLOAD_DIR);
const rabbitMQ = new RabbitMQProvider(process.env.RABBITMQ_URL || 'amqp://user:password@localhost');

export async function POST(req: NextRequest): Promise<NextResponse> {
  return new Promise<NextResponse>((resolve) => {
    const headers: Record<string, string> = {};
    req.headers.forEach((value, key) => { headers[key] = value; });

    const busboy = Busboy({ headers });
    let jobId: string | null = null;

    const filePromises: Promise<void>[] = [];

    busboy.on('file', (name, fileStream, info) => {
      const { filename, mimeType } = info;
      const uniqueName = `${Date.now()}-${filename}`;

      const filePromise = (async () => {
        try {
          // Save to disk via stream
          const filePath = await fileStore.save(uniqueName, fileStream);

          // Record in DB
          const job = await db.job.create({
            data: {
              originalName: filename,
              filePath: filePath,
              status: 'PENDING',
              type: mimeType.split('/')[0].toUpperCase() as any,
              expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
            },
          });

          jobId = job.id;

          // Queue for processing
          await rabbitMQ.connect();
          const queueName = job.type === 'IMAGE' ? 'image_priority_queue' : 'video_standard_queue';
          await rabbitMQ.publish(queueName, {
            jobId: job.id,
            filePath,
            fileType: job.type,
          });
          await rabbitMQ.close();

        } catch (err) {
          console.error('Streaming error:', err);
          throw err;
        }
      })();

      filePromises.push(filePromise);
    });

    busboy.on('finish', async () => {
      try {
        await Promise.all(filePromises);
        resolve(NextResponse.json({ jobId }));
      } catch (error) {
        resolve(NextResponse.json({ error: 'Processing error' }, { status: 500 }));
      }
    });

    busboy.on('error', (err) => {
      console.error('Busboy error:', err);
      resolve(NextResponse.json({ error: 'Stream interrupted' }, { status: 500 }));
    });

    // Pipe the web stream to the node stream-compatible busboy
    if (req.body) {
      Readable.fromWeb(req.body as any).pipe(busboy);
    } else {
      resolve(NextResponse.json({ error: 'No body' }, { status: 400 }));
    }
  });
}
