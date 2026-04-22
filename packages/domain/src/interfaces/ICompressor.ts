export interface CompressionOptions {
  quality?: number;
  width?: number;
  height?: number;
  format?: string;
  bitrate?: string;
}

export interface ICompressor {
  compress(inputPath: string, outputPath: string, options?: CompressionOptions): Promise<void>;
  supports(mimeType: string): boolean;
}
