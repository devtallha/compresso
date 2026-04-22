import { ICompressor } from './interfaces/ICompressor';
import { ImageCompressor } from './strategies/ImageCompressor';
import { VideoCompressor } from './strategies/VideoCompressor';

export class CompressorFactory {
  private static strategies: ICompressor[] = [
    new ImageCompressor(),
    new VideoCompressor(),
  ];

  static getCompressor(mimeType: string): ICompressor {
    const strategy = this.strategies.find((s) => s.supports(mimeType));
    if (!strategy) {
      throw new Error(`Unsupported mime type: ${mimeType}`);
    }
    return strategy;
  }
}
