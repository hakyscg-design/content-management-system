import Link from "next/link";
import {
  copy,
  localizeRecordLabel,
  localizeValue,
  type OperatorCopy,
  type OperatorLanguage
} from "../i18n.js";
import { getOperatorLanguage } from "../language-context.js";
import { OperationNotice } from "../operation-notice.js";
import { getOperatorDashboardView } from "../project-context.js";

export const dynamic = "force-dynamic";

export default async function Page() {
  const view = await getOperatorDashboardView();
  const language = await getOperatorLanguage();
  const text = copy[language];
  const control = view.operationsControl;

  return (
    <>
      <header className="page-header">
        <div>
          <h2 className="page-title">{text.pages.workflow.title}</h2>
          <p className="page-copy">{text.pages.workflow.copy}</p>
        </div>
      </header>
      <OperationNotice
        language={language}
        operation={view.lastOperation}
        text={text.common}
      />

      <div className="grid">
        <section className="panel" aria-labelledby="pending-title">
          <h2 className="panel-title" id="pending-title">
            {text.pages.workflow.pending}
          </h2>
          {control.pendingActions.length > 0 ? (
            <div className="record-list">
              {control.pendingActions.map((item) => (
                <article className="record" key={`${item.route}:${item.id}`}>
                  <strong>{localizeRecordLabel(item.label, language)}</strong>
                  <div className="meta">{item.id}</div>
                  <div className="meta">
                    {text.common.state}: {localizeValue(item.state, language)}
                  </div>
                  <div className="meta">
                    {text.common.next}: {localizeValue(item.action, language)}
                  </div>
                  <div className="actions">
                    <Link
                      className="button secondary compact"
                      href={item.route}
                    >
                      {text.common.openWorkspace}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty">{text.pages.workflow.noPending}</div>
          )}
        </section>

        <section className="panel" aria-labelledby="failures-title">
          <h2 className="panel-title" id="failures-title">
            {text.pages.workflow.failedOperations}
          </h2>
          {control.failedOperations.length > 0 ? (
            <div className="record-list">
              {control.failedOperations.map((operation) => (
                <article className="record" key={operation.id}>
                  <strong>{localizeValue(operation.title, language)}</strong>
                  <div className="meta">{operation.id}</div>
                  <div className="meta">
                    {localizeValue(operation.message, language)}
                  </div>
                  {operation.code ? (
                    <div className="meta">
                      {text.common.code}: {operation.code}
                    </div>
                  ) : null}
                  <div className="meta">
                    {text.pages.workflow.requiredAction}:{" "}
                    {localizeValue(operation.requiredAction, language)}
                  </div>
                  <div className="actions">
                    <Link
                      className="button secondary compact"
                      href={operation.contextRoute}
                    >
                      {text.common.openOwnerWorkspace}
                    </Link>
                  </div>
                  {operation.canRecover ? (
                    <form
                      className="inline-form"
                      action="/api/local/workflow-recovery"
                      method="post"
                    >
                      <input
                        name="operationId"
                        type="hidden"
                        value={operation.id}
                      />
                      <input
                        className="field"
                        name="note"
                        placeholder={text.pages.workflow.recoveryPlaceholder}
                        required
                      />
                      <button
                        className="button secondary compact"
                        type="submit"
                      >
                        {text.pages.workflow.recordRecovery}
                      </button>
                      <div className="meta">
                        {text.pages.workflow.recoveryGuidance}
                      </div>
                    </form>
                  ) : (
                    <div className="meta">
                      {text.pages.workflow.recoveryRecorded}
                    </div>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="empty">{text.pages.workflow.noFailures}</div>
          )}
        </section>

        <section className="panel" aria-labelledby="runs-title">
          <h2 className="panel-title" id="runs-title">
            {text.pages.workflow.workflowRuns}
          </h2>
          <RecordList
            language={language}
            records={control.workflowRuns}
            empty={text.pages.workflow.noWorkflowRuns}
            text={text}
          />
        </section>

        <section className="panel" aria-labelledby="operations-title">
          <h2 className="panel-title" id="operations-title">
            {text.pages.workflow.recentOperations}
          </h2>
          <RecordList
            language={language}
            records={control.recentOperations}
            empty={text.pages.workflow.noRecentOperations}
            text={text}
          />
        </section>
      </div>
    </>
  );
}

function RecordList({
  records,
  empty,
  language,
  text
}: {
  readonly records: readonly {
    readonly id: string;
    readonly title?: string;
    readonly label?: string;
    readonly ok?: boolean;
    readonly status?: string;
    readonly currentState?: string;
    readonly message?: string;
    readonly nextAction?: string;
    readonly targetRoute?: string;
    readonly contextRoute?: string;
  }[];
  readonly empty: string;
  readonly language: OperatorLanguage;
  readonly text: OperatorCopy;
}) {
  if (records.length === 0) return <div className="empty">{empty}</div>;

  return (
    <div className="record-list">
      {records.map((record) => (
        <article className="record" key={record.id}>
          <strong>
            {record.title
              ? localizeValue(record.title, language)
              : record.label
                ? localizeRecordLabel(record.label, language)
                : record.id}
          </strong>
          <div className="meta">{record.id}</div>
          {record.message ? (
            <div className="meta">
              {localizeValue(record.message, language)}
            </div>
          ) : null}
          {(record.currentState ?? record.status) ? (
            <div className="meta">
              {text.common.state}:{" "}
              {localizeValue(record.currentState ?? record.status, language)}
            </div>
          ) : null}
          {record.ok !== undefined ? (
            <div className="meta">
              {text.common.result}:{" "}
              {record.ok ? text.common.passed : text.common.failed}
            </div>
          ) : null}
          {record.nextAction ? (
            <div className="meta">
              {text.common.next}: {localizeValue(record.nextAction, language)}
            </div>
          ) : null}
          {record.targetRoute ? (
            <div className="actions">
              <Link
                className="button secondary compact"
                href={record.targetRoute}
              >
                {text.common.openContext}
              </Link>
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}
