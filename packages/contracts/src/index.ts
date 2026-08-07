export type ContractVersion = `${number}.${number}.${number}`;
export type MessageKind = "command" | "event" | "query";

export interface ContractEnvelope<TPayload> {
  readonly kind: MessageKind;
  readonly name: string;
  readonly version: ContractVersion;
  readonly ownerServiceId: string;
  readonly consumerServiceId?: string;
  readonly operationId: string;
  readonly payload: TPayload;
}

export interface ContractResult<TPayload> {
  readonly ok: boolean;
  readonly operationId: string;
  readonly payload?: TPayload;
  readonly errorCode?: string;
}

export interface IntegrationPort<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>;
}

export interface AuditHook<TPayload> {
  record(payload: TPayload): Promise<void>;
}

export interface ServiceCommand<TPayload> {
  readonly name: string;
  readonly version: ContractVersion;
  readonly targetOwnerServiceId: string;
  readonly operationId: string;
  readonly payload: TPayload;
}

export interface ServiceEvent<TPayload> {
  readonly name: string;
  readonly version: ContractVersion;
  readonly producerServiceId: string;
  readonly operationId: string;
  readonly payload: TPayload;
}

export type CommandHandler<TPayload, TResult> = (command: ServiceCommand<TPayload>) => Promise<TResult>;
export type EventHandler<TPayload> = (event: ServiceEvent<TPayload>) => Promise<void>;

export class CommandRouter {
  private readonly handlers = new Map<string, CommandHandler<unknown, unknown>>();

  register<TPayload, TResult>(commandName: string, targetOwnerServiceId: string, handler: CommandHandler<TPayload, TResult>): void {
    this.handlers.set(routeKey(commandName, targetOwnerServiceId), handler as CommandHandler<unknown, unknown>);
  }

  async dispatch<TPayload, TResult>(command: ServiceCommand<TPayload>): Promise<ContractResult<TResult>> {
    const handler = this.handlers.get(routeKey(command.name, command.targetOwnerServiceId));
    if (!handler) {
      return Object.freeze({
        ok: false,
        operationId: command.operationId,
        errorCode: "FTV-CONTRACT-NO-HANDLER"
      });
    }

    try {
      const payload = (await handler(command as ServiceCommand<unknown>)) as TResult;
      return Object.freeze({
        ok: true,
        operationId: command.operationId,
        payload
      });
    } catch {
      return Object.freeze({
        ok: false,
        operationId: command.operationId,
        errorCode: "FTV-CONTRACT-HANDLER-FAILED"
      });
    }
  }
}

export class EventBus {
  private readonly handlers = new Map<string, EventHandler<unknown>[]>();
  readonly publishedEvents: ServiceEvent<unknown>[] = [];

  subscribe<TPayload>(eventName: string, handler: EventHandler<TPayload>): void {
    const handlers = this.handlers.get(eventName) ?? [];
    handlers.push(handler as EventHandler<unknown>);
    this.handlers.set(eventName, handlers);
  }

  async publish<TPayload>(event: ServiceEvent<TPayload>): Promise<ContractResult<{ delivered: number }>> {
    this.publishedEvents.push(event as ServiceEvent<unknown>);
    const handlers = this.handlers.get(event.name) ?? [];

    try {
      for (const handler of handlers) {
        await handler(event as ServiceEvent<unknown>);
      }

      return Object.freeze({
        ok: true,
        operationId: event.operationId,
        payload: { delivered: handlers.length }
      });
    } catch {
      return Object.freeze({
        ok: false,
        operationId: event.operationId,
        errorCode: "FTV-CONTRACT-EVENT-HANDLER-FAILED"
      });
    }
  }
}

export function createContractEnvelope<TPayload>(input: ContractEnvelope<TPayload>): ContractEnvelope<TPayload> {
  if (!input.name || !input.version || !input.ownerServiceId || !input.operationId) {
    throw new Error("contract envelope requires name, version, ownerServiceId, and operationId.");
  }

  return Object.freeze({ ...input });
}

export function createServiceCommand<TPayload>(input: ServiceCommand<TPayload>): ServiceCommand<TPayload> {
  if (!input.name || !input.version || !input.targetOwnerServiceId || !input.operationId) {
    throw new Error("service command requires name, version, targetOwnerServiceId, and operationId.");
  }

  return Object.freeze({ ...input });
}

export function createServiceEvent<TPayload>(input: ServiceEvent<TPayload>): ServiceEvent<TPayload> {
  if (!input.name || !input.version || !input.producerServiceId || !input.operationId) {
    throw new Error("service event requires name, version, producerServiceId, and operationId.");
  }

  return Object.freeze({ ...input });
}

function routeKey(name: string, ownerServiceId: string): string {
  return `${ownerServiceId}:${name}`;
}
