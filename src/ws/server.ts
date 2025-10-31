import 'dotenv/config';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { getAWSCognitoService } from 'src/services/aws/cognito/cognito.service';
import { getRedisSubscriber } from 'src/services/redis/redis.service';

const WS_PORT = parseInt(process.env.WS_PORT || '4001');
const WS_HOST = process.env.WS_HOST || '0.0.0.0';
const CORS_ORIGIN = process.env.FRONTEND_URL || '*';

async function bootstrap() {
  const httpServer = createServer();
  const io = new Server(httpServer, {
    cors: { origin: CORS_ORIGIN }
  });

  // Redis adapter for scaling Socket.IO across instances
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  const pubClient = createClient({ url: redisUrl });
  const subClient = pubClient.duplicate();
  await pubClient.connect();
  await subClient.connect();
  io.adapter(createAdapter(pubClient, subClient));

  // JWT auth via Cognito on connection
  const identityService = getAWSCognitoService(process.env.AWS_REGION || '');
  io.use(async (socket, next) => {
    try {
      const headerAuth = socket.handshake.headers.authorization as string | undefined;
      const authToken = socket.handshake.auth?.token as string | undefined;
      const bearer = headerAuth?.replace(/^Bearer\s+/i, '') || authToken;
      if (!bearer) {
        return next(new Error('Unauthorized'));
      }
      const identityUser = await identityService.getUserByAccessToken(bearer);
      (socket.data as any).identityUser = identityUser;
      next();
    } catch {
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    socket.on('join_post', ({ postId }: { postId: string }) => {
      if (!postId) {
        return;
      }
      socket.join(`post:${postId}`);
    });

    socket.on('leave_post', ({ postId }: { postId: string }) => {
      if (!postId) {
        return;
      }
      socket.leave(`post:${postId}`);
    });
  });

  // Subscribe to comment events from API via Redis and broadcast to rooms
  const appSub = await getRedisSubscriber();
  await appSub.pSubscribe('comments:post:*', (message, channel) => {
      const postId = channel.split(':').pop() as string;
      const payload = JSON.parse(message);
      io.to(`post:${postId}`).emit('comments:event', payload);
  });

  httpServer.listen(WS_PORT, WS_HOST, () => {
    console.log(`WS server listening on http://${WS_HOST}:${WS_PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('WS bootstrap error', err);
  process.exit(1);
});

