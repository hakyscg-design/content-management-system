export type RuntimeEnvironment = "development" | "test" | "production";
export type LogLevel = "debug" | "info" | "warn" | "error";

export interface ProjectConfig {
  readonly environment: RuntimeEnvironment;
  readonly logLevel: LogLevel;
  readonly serviceId?: string;
}

export interface ConfigSource {
  readonly env?: Readonly<Record<string, string | undefined>>;
  readonly overrides?: Partial<ProjectConfig>;
}

const runtimeEnvironments = new Set<RuntimeEnvironment>(["development", "test", "production"]);
const logLevels = new Set<LogLevel>(["debug", "info", "warn", "error"]);

export function loadProjectConfig(source: ConfigSource = {}): ProjectConfig {
  const env = source.env ?? process.env;
  const environment = source.overrides?.environment ?? normalizeEnvironment(env.FTV_ENV);
  const logLevel = source.overrides?.logLevel ?? normalizeLogLevel(env.FTV_LOG_LEVEL);
  const serviceId = source.overrides?.serviceId ?? env.FTV_SERVICE_ID;

  const config: ProjectConfig = {
    environment,
    logLevel,
    ...(serviceId ? { serviceId } : {})
  };

  return Object.freeze(config);
}

function normalizeEnvironment(value: string | undefined): RuntimeEnvironment {
  const candidate = value ?? "development";
  if (!runtimeEnvironments.has(candidate as RuntimeEnvironment)) {
    throw new Error("FTV_ENV must be development, test, or production.");
  }

  return candidate as RuntimeEnvironment;
}

function normalizeLogLevel(value: string | undefined): LogLevel {
  const candidate = value ?? "info";
  if (!logLevels.has(candidate as LogLevel)) {
    throw new Error("FTV_LOG_LEVEL must be debug, info, warn, or error.");
  }

  return candidate as LogLevel;
}
