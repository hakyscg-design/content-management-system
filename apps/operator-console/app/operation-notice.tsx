import type { LocalOperationResult } from "@ftv/local-runtime";

interface OperationNoticeProps {
  readonly operation: LocalOperationResult | undefined;
}

export function OperationNotice({ operation }: OperationNoticeProps) {
  if (!operation) return null;

  return (
    <div
      className={`notice ${operation.ok ? "success" : "error"}`}
      role={operation.ok ? "status" : "alert"}
    >
      <strong>{operation.title}</strong>
      <div>{operation.message}</div>
      {operation.code ? (
        <div className="meta">Code: {operation.code}</div>
      ) : null}
    </div>
  );
}
