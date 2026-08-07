export type IsoTimestamp = string;
export type ActorId = string;
export type OperationId = string;

export interface ExecutionContext {
  readonly operationId: OperationId;
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
