import { createClient, RedisClientType } from 'redis';

let publisherClient: RedisClientType | null = null;
let subscriberClient: RedisClientType | null = null;

export async function getRedisPublisher(): Promise<RedisClientType> {
  if (publisherClient) {return publisherClient;}
  const url = process.env.REDIS_URL || 'redis://localhost:6379';
  publisherClient = createClient({ url });
  if (!publisherClient.isOpen) {
    await publisherClient.connect();
  }
  return publisherClient;
}

export async function getRedisSubscriber(): Promise<RedisClientType> {
  if (subscriberClient) {return subscriberClient;}
  const url = process.env.REDIS_URL || 'redis://localhost:6379';
  subscriberClient = createClient({ url });
  if (!subscriberClient.isOpen) {
    await subscriberClient.connect();
  }
  return subscriberClient;
}

export function getCommentChannel(postId: string): string {
  return `comments:post:${postId}`;
}

