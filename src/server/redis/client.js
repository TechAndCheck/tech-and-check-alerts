import redis from 'redis'
import config from '../config'

const client = redis.createClient({
  url: config.REDIS_URL,
})

export default client
