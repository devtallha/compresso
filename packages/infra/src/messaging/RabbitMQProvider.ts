import { connect, ChannelModel, Channel } from 'amqplib';

export class RabbitMQProvider {
  private connection?: ChannelModel;
  private channel?: Channel;

  constructor(private readonly url: string) {}

  async connect() {
    this.connection = await connect(this.url);
    this.channel = await this.connection.createChannel();
  }

  async publish(queue: string, message: any) {
    if (!this.channel) throw new Error('Channel not initialized');
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
  }

  async close() {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
  }
}
