// logging-middleware.ts
interface LogEntry {
  stack: 'backend' | 'frontend';
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  package: 'cache' | 'controller' | 'cron_job' | 'db' | 'domain' | 'handler' | 'repository' | 'route' | 'service' | 'api' | 'component' | 'hook' | 'page' | 'state' | 'style' | 'auth' | 'config' | 'middleware' | 'utils';
  message: string;
}

interface LogResponse {
  logID: string;
  message: string;
}

class Logger {
  private static instance: Logger;
  private readonly baseUrl = 'http://20.244.56.144/evaluation-service/logs';
  private readonly clientID = 'ddb82f69-6d1c-469d-a775-dde98d777777';
  private readonly clientSecret = 'aHRwaqwtGhnkpyVb';
  private readonly accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJrbXIubW9oaXRzaW5naEBnbWFpbC5jb20iLCJleHAiOjE3NTA2NjUyNjcsImlhdCI6MTc1MDY2NDM2NywiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImZlZjViZjIzLTE1ZTAtNDY4YS1iNjY4LTMwOWJlNjY4NGNkZCIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6Im1vaGl0IHNpbmdoIiwic3ViIjoiZGRiODJmNjktNmQxYy00NjlkLWE3NzUtZGRlOThkNzc3Nzc3In0sImVtYWlsIjoia21yLm1vaGl0c2luZ2hAZ21haWwuY29tIiwibmFtZSI6Im1vaGl0IHNpbmdoIiwicm9sbE5vIjoiMjIwMzAzMTA1MDM3OCIsImFjY2Vzc0NvZGUiOiJUUnpnV00iLCJjbGllbnRJRCI6ImRkYjgyZjY5LTZkMWMtNDY5ZC1hNzc1LWRkZTk4ZDc3Nzc3NyIsImNsaWVudFNlY3JldCI6ImFIUndhcXd0R2hua3B5VmIifQ.03uwwcyKtcbURsJQaUclcbuwVZipi8v8I9v8ls6etU0';

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public async log(
    stack: LogEntry['stack'],
    level: LogEntry['level'],
    packageName: LogEntry['package'],
    message: string
  ): Promise<LogResponse | null> {
    try {
      const logEntry: LogEntry = {
        stack,
        level,
        package: packageName,
        message
      };

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`,
          'Client-ID': this.clientID,
          'Client-Secret': this.clientSecret
        },
        body: JSON.stringify(logEntry)
      });

      if (!response.ok) {
        console.error(`Failed to log: ${response.status} ${response.statusText}`);
        return null;
      }

      const result: LogResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Error in logging middleware:', error);
      return null;
    }
  }

  // Convenience methods for different log levels
  public async debug(stack: LogEntry['stack'], packageName: LogEntry['package'], message: string) {
    return this.log(stack, 'debug', packageName, message);
  }

  public async info(stack: LogEntry['stack'], packageName: LogEntry['package'], message: string) {
    return this.log(stack, 'info', packageName, message);
  }

  public async warn(stack: LogEntry['stack'], packageName: LogEntry['package'], message: string) {
    return this.log(stack, 'warn', packageName, message);
  }

  public async error(stack: LogEntry['stack'], packageName: LogEntry['package'], message: string) {
    return this.log(stack, 'error', packageName, message);
  }

  public async fatal(stack: LogEntry['stack'], packageName: LogEntry['package'], message: string) {
    return this.log(stack, 'fatal', packageName, message);
  }
}

// Export the singleton instance and the main log function
export const logger = Logger.getInstance();

// Main Log function as specified in requirements
export const Log = (
  stack: LogEntry['stack'],
  level: LogEntry['level'],
  packageName: LogEntry['package'],
  message: string
) => {
  return logger.log(stack, level, packageName, message);
};

export default logger;