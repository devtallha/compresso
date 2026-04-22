import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';

export class LocalFileStore {
  constructor(private readonly baseDir: string) {
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }
  }

  async save(fileName: string, stream: NodeJS.ReadableStream): Promise<string> {
    const filePath = path.join(this.baseDir, fileName);
    const writeStream = fs.createWriteStream(filePath);
    await pipeline(stream, writeStream);
    return filePath;
  }

  async delete(filePath: string): Promise<void> {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  }
}
