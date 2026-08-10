import Link from "next/link";
import { OperationNotice } from "../operation-notice.js";
import { getOperatorDashboardView } from "../project-context.js";

export const dynamic = "force-dynamic";

export default async function Page() {
  const view = await getOperatorDashboardView();
  const control = view.operationsControl;

  return (
    <>
      <header className="page-header">
        <div>
          <h2 className="page-title">Workflow</h2>
          <p className="page-copy">
            Monitor project-scoped execution, review failed operations, and
            record manual recovery confirmation without changing owner-service
            business records automatically.
          </p>
        </div>
      </header>
      <OperationNotice operation={view.lastOperation} />

      <div className="grid">
        <section className="panel" aria-labelledby="pending-title">
          <h2 className="panel-title" id="pending-title">
            Pending next actions
          </h2>
          {control.pendingActions.length > 0 ? (
            <div className="record-list">
              {control.pendingActions.map((item) => (
                <article className="record" key={`${item.route}:${item.id}`}>
                  <strong>{item.label}</strong>
                  <div className="meta">{item.id}</div>
                  <div className="meta">State: {item.state}</div>
                  <div className="meta">Next: {item.action}</div>
                  <div className="actions">
                    <Link
                      className="button secondary compact"
                      href={item.route}
                    >
                      Open Workspace
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty">No pending workflow actions.</div>
          )}
        </section>

        <section className="panel" aria-labelledby="failures-title">
          <h2 className="panel-title" id="failures-title">
            Failed operations
          </h2>
          {control.failedOperations.length > 0 ? (
            <div className="record-list">
              {control.failedOperations.map((operation) => (
                <article className="record" key={operation.id}>
                  <strong>{operation.title}</strong>
                  <div className="meta">{operation.id}</div>
                  <div className="meta">{operation.message}</div>
                  {operation.code ? (
                    <div className="meta">Code: {operation.code}</div>
                  ) : null}
                  <div className="meta">
                    Required action: {operation.requiredAction}
                  </div>
                  <div className="actions">
                    <Link
                      className="button secondary compact"
                      href={operation.contextRoute}
                    >
                      Open Owner Workspace
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
                        placeholder="What did the operator review or correct?"
                        required
                      />
                      <button
                        className="button secondary compact"
                        type="submit"
                      >
                        Record Recovery Confirmation
                      </button>
                      <div className="meta">
                        This records that the operator handled the failure. It
                        does not retry or alter the owner-service business
                        record.
                      </div>
                    </form>
                  ) : (
                    <div className="meta">
                      Recovery confirmation already recorded.
                    </div>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="empty">No failed operations.</div>
          )}
        </section>

        <section className="panel" aria-labelledby="runs-title">
          <h2 className="panel-title" id="runs-title">
            Workflow runs
          </h2>
          <RecordList
            records={control.workflowRuns}
            empty="No workflow runs are recorded yet."
          />
        </section>

        <section className="panel" aria-labelledby="operations-title">
          <h2 className="panel-title" id="operations-title">
            Recent operations
          </h2>
          <RecordList
            records={control.recentOperations}
            empty="No recent operations."
          />
        </section>
      </div>
    </>
  );
}

function RecordList({
  records,
  empty
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
}) {
  if (records.length === 0) return <div className="empty">{empty}</div>;

  return (
    <div className="record-list">
      {records.map((record) => (
        <article className="record" key={record.id}>
          <strong>{record.title ?? record.label ?? record.id}</strong>
          <div className="meta">{record.id}</div>
          {record.message ? <div className="meta">{record.message}</div> : null}
          {(record.currentState ?? record.status) ? (
            <div className="meta">
              State: {record.currentState ?? record.status}
            </div>
          ) : null}
          {record.ok !== undefined ? (
            <div className="meta">
              Result: {record.ok ? "passed" : "failed"}
            </div>
          ) : null}
          {record.nextAction ? (
            <div className="meta">Next: {record.nextAction}</div>
          ) : null}
          {record.targetRoute ? (
            <div className="actions">
              <Link
                className="button secondary compact"
                href={record.targetRoute}
              >
                Open Context
              </Link>
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}
