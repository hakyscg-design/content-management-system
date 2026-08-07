export type IsoTimestamp = string;
export type ActorId = string;
export type OperationId = string;
export type ProjectId = string;

export interface CanonicalProject {
  readonly id: ProjectId;
  readonly name: string;
  readonly slug: string;
  readonly profilePath: string;
  readonly serviceNamespace: string;
}

export interface ProjectContext {
  readonly project: CanonicalProject;
}

export interface ExecutionContext {
  readonly operationId: OperationId;
  readonly projectId?: ProjectId;
  readonly actorId?: ActorId;
  readonly serviceId?: string;
  readonly requestId?: string;
}

export interface AuthContext {
  readonly actorId: ActorId;
  readonly authenticationMethod?: string;
  readonly claims?: Readonly<Record<string, string>>;
}

export interface AuthorizationCheckRequest {
  readonly actor: AuthContext;
  readonly action: string;
  readonly targetRef: string;
  readonly ownerServiceId: string;
}

export interface AuthorizationCheckResult {
  readonly allowed: boolean;
  readonly reason?: string;
}

export interface StoragePort<TRecord> {
  get(id: string): Promise<TRecord | undefined>;
  save(record: TRecord): Promise<void>;
}

export interface TransactionBoundary {
  run<T>(operation: () => Promise<T>): Promise<T>;
}
