"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQProvider = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
class RabbitMQProvider {
    url;
    connection;
    channel;
    constructor(url) {
        this.url = url;
    }
    async connect() {
        this.connection = await amqplib_1.default.connect(this.url);
        this.channel = await this.connection.createChannel();
    }
    async publish(queue, message) {
        if (!this.channel)
            throw new Error('Channel not initialized');
        await this.channel.assertQueue(queue, { durable: true });
        this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
            persistent: true,
        });
    }
    async close() {
        await this.channel?.close();
        await this.connection?.close();
    }
}
exports.RabbitMQProvider = RabbitMQProvider;
