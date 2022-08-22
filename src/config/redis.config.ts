import Redis from 'ioredis';
import 'dotenv/config';
import { promisify } from 'util';

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: 6379,
  password: process.env.REDIS_PASSWORD,
});

export const getRedis = (value: string) => {
  const syncRedis = promisify(redis.get).bind(redis);
  return syncRedis(value);
};

export const setRedis = (key: string, value: string) => {
  const syncRedis = promisify(redis.get).bind(redis);
  return syncRedis(key, value);
};

export default redis;
