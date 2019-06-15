import {
  createLogger,
  format,
  transports,
} from 'winston'

import config from '../config'

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({
      stack: true,
    }),
    format.splat(),
    format.json(),
  ),
  defaultMeta: { service: 'tech-and-check-alerts' },
  transports: [
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new transports.File({
      filename: 'logs/combined.log',
    }),
  ],
})

if (config.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.timestamp({
        format: 'HH:mm:ss',
      }),
      format.colorize(),
      format.timestamp(),
      format.align(),
      format.printf(info => `${info.timestamp} (${info.level}): ${info.message} ${info.stack}`),
    ),
  }))
}

export default logger
