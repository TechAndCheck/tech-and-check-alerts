import redis from 'redis'
import { promisifyClient } from '../utils/redis'
import config from '../config'

export default promisifyClient(redis.createClient({
  url: config.REDIS_URL,
}))
