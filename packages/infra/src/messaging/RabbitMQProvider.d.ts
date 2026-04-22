export declare class RabbitMQProvider {
    private readonly url;
    private connection?;
    private channel?;
    constructor(url: string);
    connect(): Promise<void>;
    publish(queue: string, message: any): Promise<void>;
    close(): Promise<void>;
}
