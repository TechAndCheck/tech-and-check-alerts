import dotenv from 'dotenv'

dotenv.config()

const {
  ENABLED_QUEUE_DIRECTORIES,
} = process.env

export default {
  ...process.env,
  ENABLED_QUEUE_DIRECTORIES: ENABLED_QUEUE_DIRECTORIES.split(','),
}
