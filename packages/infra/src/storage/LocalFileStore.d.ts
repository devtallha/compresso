export declare class LocalFileStore {
    private readonly baseDir;
    constructor(baseDir: string);
    save(fileName: string, stream: NodeJS.ReadableStream): Promise<string>;
    delete(filePath: string): Promise<void>;
}
