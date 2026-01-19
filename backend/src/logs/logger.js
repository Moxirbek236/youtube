import winston from "winston";
import path from "path";
import fs from "fs";

const logDir = path.join(process.cwd(), "src", "logs");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ level, message, timestamp, stack }) => {
    return `[ ${timestamp} ] [ ${level.toUpperCase()} ] - {${stack || message}}`;
  }),
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "HH:mm:ss" }),
  winston.format.printf(({ level, message, timestamp, stack }) => {
    return `[ ${timestamp} ] [ ${level} ] - {${stack || message}}`;
  })
);

const logger = winston.createLogger({
  level: "info",
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
      format: fileFormat,
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}

export default logger;
