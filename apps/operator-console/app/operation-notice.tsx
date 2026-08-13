import type { LocalOperationResult } from "@ftv/local-runtime";
import {
  localizeValue,
  type OperatorCopy,
  type OperatorLanguage
} from "./i18n.js";

interface OperationNoticeProps {
  readonly language: OperatorLanguage;
  readonly operation: LocalOperationResult | undefined;
  readonly text: OperatorCopy["common"];
}

export function OperationNotice({
  language,
  operation,
  text
}: OperationNoticeProps) {
  if (!operation) return null;

  return (
    <div
      className={`notice ${operation.ok ? "success" : "error"}`}
      role={operation.ok ? "status" : "alert"}
    >
      <strong>{localizeValue(operation.title, language)}</strong>
      <div>{localizeValue(operation.message, language)}</div>
      {operation.code ? (
        <div className="meta">
          {text.code}: {operation.code}
        </div>
      ) : null}
    </div>
  );
}
