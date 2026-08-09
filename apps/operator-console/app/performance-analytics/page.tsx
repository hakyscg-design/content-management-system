import { getOperatorDashboardView } from "../project-context.js";

export const dynamic = "force-dynamic";

export default async function Page() {
  const view = await getOperatorDashboardView();
  const readyForFeedback = view.executionFlow.publishingPackages.filter(
    (record) => record.canRecordPerformance
  );
  const facts = view.records.filter(
    (record) => record.entityType === "PerformanceFact"
  );
  const feedback = view.executionFlow.performanceFeedback;

  return (
    <>
      <header className="page-header">
        <div>
          <h2 className="page-title">Performance & Analytics</h2>
          <p className="page-copy">
            Record manual performance facts for completed publishing packages,
            then capture an analytics report and learning summary.
          </p>
        </div>
      </header>

      <div className="grid">
        <section className="panel" aria-labelledby="performance-create-title">
          <h2 className="panel-title" id="performance-create-title">
            Record performance feedback
          </h2>
          {readyForFeedback.length === 0 ? (
            <div className="empty">
              No completed publishing packages are waiting for performance
              feedback.
            </div>
          ) : null}
          <form
            className="form-stack"
            action="/api/local/performance-feedback"
            method="post"
          >
            <label>
              Published content
              <select
                className="field"
                name="publishingPackageId"
                required
                disabled={readyForFeedback.length === 0}
              >
                {readyForFeedback.map((record) => (
                  <option key={record.id} value={record.id}>
                    {record.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Import source
              <input className="field" name="source" placeholder="manual" />
            </label>
            <div className="metric-grid">
              <label>
                Views
                <input className="field" min="0" name="views" type="number" />
              </label>
              <label>
                Likes
                <input className="field" min="0" name="likes" type="number" />
              </label>
              <label>
                Comments
                <input
                  className="field"
                  min="0"
                  name="comments"
                  type="number"
                />
              </label>
              <label>
                Shares
                <input className="field" min="0" name="shares" type="number" />
              </label>
              <label>
                Watch minutes
                <input
                  className="field"
                  min="0"
                  name="watchMinutes"
                  type="number"
                />
              </label>
            </div>
            <label>
              Analytics narrative
              <textarea
                className="field"
                name="narrative"
                placeholder="Manual interpretation of the imported facts"
              />
            </label>
            <label>
              Learning summary
              <textarea
                className="field"
                name="learningSummary"
                placeholder="Manual learning to carry into future work"
              />
            </label>
            <button
              className="button"
              type="submit"
              disabled={readyForFeedback.length === 0}
            >
              Record Feedback
            </button>
          </form>
        </section>

        <section className="panel" aria-labelledby="imports-title">
          <h2 className="panel-title" id="imports-title">
            Performance imports
          </h2>
          <RecordList
            records={feedback.imports}
            empty="No performance imports yet."
          />
        </section>

        <section className="panel" aria-labelledby="facts-title">
          <h2 className="panel-title" id="facts-title">
            Performance facts
          </h2>
          <RecordList records={facts} empty="No performance facts yet." />
        </section>

        <section className="panel" aria-labelledby="reports-title">
          <h2 className="panel-title" id="reports-title">
            Analytics reports
          </h2>
          <RecordList
            records={feedback.reports}
            empty="No analytics reports yet."
          />
        </section>

        <section className="panel" aria-labelledby="learning-title">
          <h2 className="panel-title" id="learning-title">
            Learning summaries
          </h2>
          <RecordList
            records={feedback.learningSummaries}
            empty="No learning summaries yet."
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
    readonly label: string;
    readonly status: string;
    readonly nextAction?: string;
  }[];
  readonly empty: string;
}) {
  if (records.length === 0) return <div className="empty">{empty}</div>;

  return (
    <div className="record-list">
      {records.map((record) => (
        <article className="record" key={record.id}>
          <strong>{record.label}</strong>
          <div className="meta">{record.id}</div>
          <div className="meta">State: {record.status}</div>
          {record.nextAction ? (
            <div className="meta">Next: {record.nextAction}</div>
          ) : null}
        </article>
      ))}
    </div>
  );
}
