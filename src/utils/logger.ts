/**
 * Simple logger utility that only logs in development mode
 * In production, logs are silently ignored
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface Logger {
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

const isDevelopment = process.env.NODE_ENV === 'development';

const createLogMethod = (level: LogLevel): ((...args: unknown[]) => void) => {
  return (...args: unknown[]): void => {
    if (!isDevelopment) return;
    
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    
    switch (level) {
      case 'debug':
        console.debug(prefix, ...args);
        break;
      case 'info':
        console.info(prefix, ...args);
        break;
      case 'warn':
        console.warn(prefix, ...args);
        break;
      case 'error':
        console.error(prefix, ...args);
        break;
    }
  };
};

export const logger: Logger = {
  debug: createLogMethod('debug'),
  info: createLogMethod('info'),
  warn: createLogMethod('warn'),
  error: createLogMethod('error'),
};
