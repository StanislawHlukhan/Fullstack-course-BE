import { getRedisPublisher, getCommentChannel } from './redis.service';

type CommentEventType = 'create' | 'update' | 'delete';

export async function publishCommentEvent(event: {
  type: CommentEventType,
  postId: string,
  comment: unknown
}) {
  const pub = await getRedisPublisher();
  const channel = getCommentChannel(event.postId);
  await pub.publish(channel, JSON.stringify(event));
}

