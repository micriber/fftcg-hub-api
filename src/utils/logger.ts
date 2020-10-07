import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const format = winston.format;
const env = process.env.NODE_ENV ?? 'development';

const logger = winston.createLogger({
    transports: new DailyRotateFile({
        filename: `logs/${env}/api-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        format: format.combine(
            format.timestamp(),
            format.printf((info) => {
                const body = info.body
                    ? `body : ${JSON.stringify(info.body)}`
                    : '';
                const params = info.params
                    ? `params : ${JSON.stringify(info.params)}`
                    : '';
                return `${info.timestamp as string} ${info.level}: ${
                    info.message
                } ${body} ${params}`;
            })
        ),
    }),
});

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'test') {
    logger.add(
        new winston.transports.Console({
            format: format.combine(
                format.timestamp(),
                format.colorize(),
                format.printf(
                    (info) =>
                        `${info.timestamp as string} ${info.level}: ${
                            info.message
                        }`
                )
            ),
        })
    );
}

export default logger;
