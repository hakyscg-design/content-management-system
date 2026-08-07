export type LogSeverity = "debug" | "info" | "warn" | "error";

export interface LogContext {
  readonly operationId?: string;
  readonly serviceId?: string;
  readonly requestId?: string;
  readonly errorCode?: string;
}

export interface LogRecord {
  readonly timestamp: string;
  readonly level: LogSeverity;
  readonly message: string;
  readonly context: LogContext;
  readonly error?: {
    readonly name: string;
    readonly message: string;
  };
}

export interface LogSink {
  write(record: LogRecord): void;
}

export class MemoryLogSink implements LogSink {
  readonly records: LogRecord[] = [];

  write(record: LogRecord): void {
    this.records.push(record);
  }
}

export class Logger {
  constructor(private readonly sink: LogSink) {}

  log(level: LogSeverity, message: string, context: LogContext = {}, error?: unknown): LogRecord {
    const formattedError = formatError(error);
    const record: LogRecord = Object.freeze({
      timestamp: new Date().toISOString(),
      level,
      message,
      context: Object.freeze({ ...context }),
      ...(formattedError ? { error: formattedError } : {})
    });

    this.sink.write(record);
    return record;
  }
}

function formatError(error: unknown): LogRecord["error"] {
  if (!(error instanceof Error)) return undefined;

  return {
    name: error.name,
    message: error.message
  };
}
