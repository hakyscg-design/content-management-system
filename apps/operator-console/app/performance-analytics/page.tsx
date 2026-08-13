import {
  copy,
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
  const readyForFeedback = view.executionFlow.publishingPackages.filter(
    (record) => record.canRecordPerformance
  );
  const facts = view.records.filter(
    (record) => record.entityType === "PerformanceFact"
  );
  const feedback = view.executionFlow.performanceFeedback;
  const importsReadyForReport = feedback.imports.filter(
    (record) => !record.hasAnalyticsReport
  );
  const reportsReadyForLearning = feedback.reports.filter(
    (record) => !record.hasLearningSummary
  );

  return (
    <>
      <header className="page-header">
        <div>
          <h2 className="page-title">{text.pages.performance.title}</h2>
          <p className="page-copy">{text.pages.performance.copy}</p>
        </div>
      </header>
      <OperationNotice
        language={language}
        operation={view.lastOperation}
        text={text.common}
      />

      <div className="grid">
        <section className="panel" aria-labelledby="performance-create-title">
          <h2 className="panel-title" id="performance-create-title">
            {text.pages.performance.recordFeedback}
          </h2>
          {readyForFeedback.length === 0 ? (
            <div className="empty">{text.pages.performance.noCompleted}</div>
          ) : null}
          <form
            className="form-stack"
            action="/api/local/performance-feedback"
            method="post"
          >
            <label>
              {text.pages.performance.publishedContent}
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
              {text.pages.performance.importSource}
              <input className="field" name="source" placeholder="manual" />
            </label>
            <div className="metric-grid">
              <label>
                {text.pages.performance.views}
                <input className="field" min="0" name="views" type="number" />
              </label>
              <label>
                {text.pages.performance.likes}
                <input className="field" min="0" name="likes" type="number" />
              </label>
              <label>
                {text.pages.performance.comments}
                <input
                  className="field"
                  min="0"
                  name="comments"
                  type="number"
                />
              </label>
              <label>
                {text.pages.performance.shares}
                <input className="field" min="0" name="shares" type="number" />
              </label>
              <label>
                {text.pages.performance.watchMinutes}
                <input
                  className="field"
                  min="0"
                  name="watchMinutes"
                  type="number"
                />
              </label>
            </div>
            <button
              className="button"
              type="submit"
              disabled={readyForFeedback.length === 0}
            >
              {text.pages.performance.importMetrics}
            </button>
          </form>
        </section>

        <section className="panel" aria-labelledby="report-create-title">
          <h2 className="panel-title" id="report-create-title">
            {text.pages.performance.createReport}
          </h2>
          {importsReadyForReport.length === 0 ? (
            <div className="empty">{text.pages.performance.noImports}</div>
          ) : null}
          <form
            className="form-stack"
            action="/api/local/analytics-report"
            method="post"
          >
            <label>
              {text.pages.performance.performanceImport}
              <select
                className="field"
                name="performanceImportId"
                required
                disabled={importsReadyForReport.length === 0}
              >
                {importsReadyForReport.map((record) => (
                  <option key={record.id} value={record.id}>
                    {record.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {text.pages.performance.reportTitle}
              <input
                className="field"
                name="title"
                placeholder={text.pages.performance.reportTitlePlaceholder}
              />
            </label>
            <label>
              {text.pages.performance.narrative}
              <textarea
                className="field"
                name="narrative"
                placeholder={text.pages.performance.narrativePlaceholder}
                required
              />
            </label>
            <button
              className="button"
              type="submit"
              disabled={importsReadyForReport.length === 0}
            >
              {text.pages.performance.createReport}
            </button>
          </form>
        </section>

        <section className="panel" aria-labelledby="learning-create-title">
          <h2 className="panel-title" id="learning-create-title">
            {text.pages.performance.recordLearningSummary}
          </h2>
          {reportsReadyForLearning.length === 0 ? (
            <div className="empty">{text.pages.performance.noReports}</div>
          ) : null}
          <form
            className="form-stack"
            action="/api/local/learning-summary"
            method="post"
          >
            <label>
              {text.pages.performance.analyticsReport}
              <select
                className="field"
                name="reportId"
                required
                disabled={reportsReadyForLearning.length === 0}
              >
                {reportsReadyForLearning.map((record) => (
                  <option key={record.id} value={record.id}>
                    {record.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {text.pages.performance.learningSummary}
              <textarea
                className="field"
                name="summary"
                placeholder={text.pages.performance.learningPlaceholder}
                required
              />
            </label>
            <button
              className="button"
              type="submit"
              disabled={reportsReadyForLearning.length === 0}
            >
              {text.pages.performance.recordLearning}
            </button>
          </form>
        </section>

        <section className="panel" aria-labelledby="imports-title">
          <h2 className="panel-title" id="imports-title">
            {text.pages.performance.performanceImports}
          </h2>
          <RecordList
            language={language}
            records={feedback.imports}
            empty={text.pages.performance.noPerformanceImports}
            text={text}
          />
        </section>

        <section className="panel" aria-labelledby="facts-title">
          <h2 className="panel-title" id="facts-title">
            {text.pages.performance.performanceFacts}
          </h2>
          <RecordList
            language={language}
            records={facts}
            empty={text.pages.performance.noPerformanceFacts}
            text={text}
          />
        </section>

        <section className="panel" aria-labelledby="reports-title">
          <h2 className="panel-title" id="reports-title">
            {text.pages.performance.analyticsReports}
          </h2>
          <RecordList
            language={language}
            records={feedback.reports}
            empty={text.pages.performance.noAnalyticsReports}
            text={text}
          />
        </section>

        <section className="panel" aria-labelledby="learning-title">
          <h2 className="panel-title" id="learning-title">
            {text.pages.performance.learningSummaries}
          </h2>
          <RecordList
            language={language}
            records={feedback.learningSummaries}
            empty={text.pages.performance.noLearningSummaries}
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
    readonly label: string;
    readonly status: string;
    readonly nextAction?: string;
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
          <strong>{record.label}</strong>
          <div className="meta">{record.id}</div>
          <div className="meta">
            {text.common.state}: {record.status}
          </div>
          {record.nextAction ? (
            <div className="meta">
              {text.common.next}: {localizeValue(record.nextAction, language)}
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}
