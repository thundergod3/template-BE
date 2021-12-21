import pkg from "winston";

const { transports, createLogger, format } = pkg;

const devLogger = new transports.Console({
  handleExceptions: true,
  json: false,
  colorize: true,
});

const prodLogger = new transports.File({
  filename: "logs/prod.log",
  handleExceptions: true,
  json: true,
  maxsize: 5242880, // 5MB
  maxFiles: 5,
  colorize: false,
});

const transport =
  process.env.NODE_ENV === "production" ? prodLogger : devLogger;

const logger = createLogger({
  transports: transport,
  format: format.combine(format.timestamp(), format.json()),
});

export default logger;
