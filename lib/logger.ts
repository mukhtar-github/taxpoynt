// lib/logger.ts
type LogLevel = 'info' | 'error' | 'debug';

interface LogMessage {
  level: LogLevel;
  message: string;
  data?: any;
}

class Logger {
  log({ level, message, data }: LogMessage) {
    const timestamp = new Date().toISOString();
    if (data) {
      console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`, data);
    } else {
      console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
    }
  }

  info(message: string, data?: any) {
    this.log({ level: 'info', message, data });
  }

  error(message: string, data?: any) {
    this.log({ level: 'error', message, data });
  }

  debug(message: string, data?: any) {
    this.log({ level: 'debug', message, data });
  }
}

export const logger = new Logger();
