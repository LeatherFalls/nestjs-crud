import Redis from 'ioredis';
import 'dotenv/config';

const redis = new Redis();

export default redis;
