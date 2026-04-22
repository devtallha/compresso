import ffmpeg from 'fluent-ffmpeg';
import { ICompressor, CompressionOptions } from '../interfaces/ICompressor';

export class VideoCompressor implements ICompressor {
  async compress(inputPath: string, outputPath: string, options?: CompressionOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      let command = ffmpeg(inputPath)
        .videoCodec('libx264')
        .audioCodec('aac')
        .outputOptions([
          '-crf 26',       // Slightly better quality/size than 28
          '-preset slow',  // Maximum compression efficiency
          '-movflags +faststart', // Web optimization (play while downloading)
          '-pix_fmt yuv420p',     // Best compatibility for devices
          '-profile:v high',
          '-level 4.0'
        ]);

      if (options?.bitrate) {
        command = command.videoBitrate(options.bitrate);
      }

      command
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .save(outputPath);
    });
  }

  supports(mimeType: string): boolean {
    return mimeType.startsWith('video/');
  }
}
