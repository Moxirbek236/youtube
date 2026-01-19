import Logger from "../logs/logger.js";

const errorHandler = (err, req, res, next) => {
    const status = err.status || 500;

    if (!err.status || status >= 500) {
        Logger.error(err, { stack: err.stack });
    }

    res.status(status).json({
        message: err.message || "Internal Server Error",
    });
};

export default errorHandler;