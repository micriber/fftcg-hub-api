import winston from 'winston';

const format = winston.format;
const env = process.env.NODE_ENV ?? 'development';

const devFormat = format.combine(
    format.timestamp(),
    format.colorize(),
    format.printf(
        (info) =>
            `${info.timestamp as string} ${info.level}: ${
                info.message
            }`
    )
);

const prodFormat = format.combine(
    format.timestamp(),
    format.printf(
        (info) =>
            `${info.timestamp as string} ${info.level}: ${
                info.message
            }`
    )
);

const logger = winston.createLogger({
  transports: new winston.transports.Console({
    format: env === 'production' ? prodFormat : devFormat
  })
});

export default logger;
