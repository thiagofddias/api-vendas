import { Request, Response, NextFunction } from 'express';
import { createClient } from 'redis';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import AppError from '@shared/errors/AppError';

export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const redisClient = createClient({
      legacyMode: true,
      password: process.env.REDIS_PASS || undefined,
      socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    });

    await redisClient.connect();

    const limiter = new RateLimiterRedis({
      storeClient: redisClient,
      keyPrefix: 'ratelimit',
      points: 5,
      duration: 5,
    });

    await limiter.consume(request.ip);

    return next();
  } catch (err) {
    throw new AppError('Too many requests.', 429);
  }
}
