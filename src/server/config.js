import dotenv from 'dotenv'

dotenv.config()

const {
  REDIS_URL,
  ENABLED_QUEUE_DIRECTORIES,
} = process.env

export default {
  REDIS_URL,
  ENABLED_QUEUE_DIRECTORIES: ENABLED_QUEUE_DIRECTORIES.split(','),
}
