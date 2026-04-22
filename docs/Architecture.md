# Technical Architecture

## 1. The Strategy Pattern
To avoid "God Objects" and messy `if/else` statements, Compresso uses the **Strategy Pattern** for all compression logic.

- `ICompressor`: The interface defining the contract.
- `ImageCompressor`: Uses **Sharp** for ultra-fast image optimization.
- `VideoCompressor`: Uses **FFmpeg** for complex video encoding.

This allows us to add support for PDFs, Audio, or 3D models simply by adding a new strategy class.

## 2. Memory-Safe Streaming
Most Node.js apps crash when 10 users upload 100MB files simultaneously because they buffer the files in RAM.
Compresso uses **Busboy** and **Node.js Streams** to pipe data:
`Request (Web Stream) -> Busboy -> FileSystem (Writable Stream)`
The file never fully exists in the server's memory.

## 3. Distributed Throughput
By using **RabbitMQ**, we decouple the "Upload" from the "Process".
If 1,000 users upload files at once, the Web app stays fast. The Worker app will simply pick them up one by one. By adding more Worker containers, we can scale to any number of users.

## 4. Janitor Service
Since we use local storage to save costs, disk management is crucial.
The `apps/worker` runs an interval service that:
1. Queries the DB for jobs older than 1 hour.
2. Deletes the raw and compressed files from disk.
3. Purges the database record.
This ensures the server never runs out of space.
