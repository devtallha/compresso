import sharp from 'sharp';
import { ICompressor, CompressionOptions } from '../interfaces/ICompressor';

export class ImageCompressor implements ICompressor {
  async compress(inputPath: string, outputPath: string, options?: CompressionOptions): Promise<void> {
    const quality = options?.quality || 80;
    
    await sharp(inputPath)
      .webp({ quality }) // Default to webp for best compression
      .toFile(outputPath);
  }

  supports(mimeType: string): boolean {
    return mimeType.startsWith('image/');
  }
}
