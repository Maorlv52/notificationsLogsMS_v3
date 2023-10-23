import winston from 'winston';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename: 'error.log', level: 'error'}),
        new winston.transports.File({filename: 'combined.log'})
    ]
});

async function loggerMiddleware(req, res, next) {
    const start = Date.now();
    const chunks = [];

    console.log(`\nLOG START - '${req.url}'`)

    const originalWrite = res.write;
    const originalEnd = res.end;

    res.write = (...args) => {
        chunks.push(Buffer.from(args[0]));
        originalWrite.apply(res, args);
    };

    res.end = async (...args) => {
        if (args[0]) {
            chunks.push(Buffer.from(args[0]));
        }

        const responseTime = Date.now() - start;
        const responseBody = Buffer.concat(chunks).toString('utf8');

        let resBodyJSON = {};

        try {
            resBodyJSON = JSON.parse(responseBody);
        } catch (error) {
            // Handle JSON parsing error if the response body is not valid JSON.
        }

        const logData = {
            reqUrl: req.url,
            request: {
                method: req.method,
                reqBody: req.body,
                timestamp: new Date().toISOString()
            },
            response: {
                status: res.statusCode,
                resBody: resBodyJSON,
                responseTime: `${responseTime}ms`,
                timestamp: new Date().toISOString()
            }
        };

        try {
            await logger.info(logData);
        } catch (error) {
            console.error('Error logging request and response:', error);
        }

        await originalEnd.apply(res, args);
    };

    res.on('error', (err) => {
        console.error('Error in response:', err);
    });

    next();
}

export {logger, loggerMiddleware};
