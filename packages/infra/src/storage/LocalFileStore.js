"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalFileStore = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const promises_1 = require("stream/promises");
class LocalFileStore {
    baseDir;
    constructor(baseDir) {
        this.baseDir = baseDir;
        if (!fs_1.default.existsSync(baseDir)) {
            fs_1.default.mkdirSync(baseDir, { recursive: true });
        }
    }
    async save(fileName, stream) {
        const filePath = path_1.default.join(this.baseDir, fileName);
        const writeStream = fs_1.default.createWriteStream(filePath);
        await (0, promises_1.pipeline)(stream, writeStream);
        return filePath;
    }
    async delete(filePath) {
        if (fs_1.default.existsSync(filePath)) {
            await fs_1.default.promises.unlink(filePath);
        }
    }
}
exports.LocalFileStore = LocalFileStore;
