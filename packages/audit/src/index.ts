export interface AuditActor {
  readonly actorId: string;
  readonly actorType?: string;
}

export interface AuditRecordDraft {
  readonly actor: AuditActor;
  readonly action: string;
  readonly targetRef: string;
  readonly reason: string;
  readonly previousState?: unknown;
  readonly newState?: unknown;
  readonly operationId: string;
}

export interface AuditRecord extends AuditRecordDraft {
  readonly timestamp: string;
}

export function createAuditRecord(input: AuditRecordDraft, now = new Date()): AuditRecord {
  if (!input.actor.actorId || !input.action || !input.targetRef || !input.reason || !input.operationId) {
    throw new Error("audit record requires actor, action, targetRef, reason, and operationId.");
  }

  return Object.freeze({
    ...input,
    timestamp: now.toISOString()
  });
}
