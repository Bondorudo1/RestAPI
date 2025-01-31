
import { createLogger, format, transports } from "winston";


const logFormat = format.combine(
  format.timestamp(),
  format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  })
);


const logger = createLogger({
  level: "info", 
  format: logFormat, 
  transports: [
    new transports.Console(), 
    new transports.File({ filename: "logs/error.log", level: "error" }), 
    new transports.File({ filename: "logs/combined.log" }),
  ],
});

// Export logger instance
export default logger;
