import { copy, type OperatorCopy } from "../i18n.js";
import { getOperatorLanguage } from "../language-context.js";
import { OperationNotice } from "../operation-notice.js";
import { getOperatorDashboardView } from "../project-context.js";

export const dynamic = "force-dynamic";

export default async function Page() {
  const view = await getOperatorDashboardView();
  const language = await getOperatorLanguage();
  const text = copy[language];
  const packages = view.executionFlow.contentPackages.filter(
    (record) => record.canApprove
  );
  const reviews = view.records.filter(
    (record) => record.entityType === "HumanReview"
  );

  return (
    <>
      <header className="page-header">
        <div>
          <h2 className="page-title">{text.pages.review.title}</h2>
          <p className="page-copy">{text.pages.review.copy}</p>
        </div>
      </header>
      <OperationNotice
        language={language}
        operation={view.lastOperation}
        text={text.common}
      />
      <div className="grid">
        <section className="panel" aria-labelledby="review-create-title">
          <h2 className="panel-title" id="review-create-title">
            {text.pages.review.approveContent}
          </h2>
          {packages.length === 0 ? (
            <div className="empty">{text.pages.review.noPackages}</div>
          ) : null}
          <form
            className="form-stack"
            action="/api/local/review-approval"
            method="post"
          >
            <label>
              {text.pages.review.contentPackage}
              <select className="field" name="contentPackageId" required>
                {packages.map((record) => (
                  <option key={record.id} value={record.id}>
                    {record.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {text.pages.review.reviewer}
              <input
                className="field"
                name="reviewerId"
                placeholder="local-operator"
              />
            </label>
            <label>
              {text.pages.review.decisionReason}
              <textarea
                className="field"
                name="reason"
                placeholder={text.pages.review.reasonPlaceholder}
              />
            </label>
            <button
              className="button"
              type="submit"
              disabled={packages.length === 0}
            >
              {text.pages.review.approveForPublishing}
            </button>
          </form>
        </section>
        <section className="panel" aria-labelledby="review-list-title">
          <h2 className="panel-title" id="review-list-title">
            {text.pages.review.reviewDecisions}
          </h2>
          <RecordList
            records={reviews}
            empty={text.pages.review.noReviews}
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
  text
}: {
  readonly records: readonly {
    readonly id: string;
    readonly label: string;
    readonly status: string;
  }[];
  readonly empty: string;
  readonly text: OperatorCopy;
}) {
  if (records.length === 0) return <div className="empty">{empty}</div>;

  return (
    <div className="record-list">
      {records.map((record) => (
        <article className="record" key={record.id}>
          <strong>{record.label}</strong>
          <div className="meta">{record.id}</div>
          <div className="meta">
            {text.common.state}: {record.status}
          </div>
        </article>
      ))}
    </div>
  );
}
