import { copy, localizeRecordLabel, localizeValue } from "../i18n.js";
import { getOperatorLanguage } from "../language-context.js";
import { OperationNotice } from "../operation-notice.js";
import { getOperatorDashboardView } from "../project-context.js";

export const dynamic = "force-dynamic";

export default async function Page() {
  const view = await getOperatorDashboardView();
  const language = await getOperatorLanguage();
  const text = copy[language];
  const packages = view.executionFlow.contentPackages.filter(
    (record) => record.canPreparePublishing
  );
  const publishing = view.executionFlow.publishingPackages;

  return (
    <>
      <header className="page-header">
        <div>
          <h2 className="page-title">{text.pages.publishing.title}</h2>
          <p className="page-copy">{text.pages.publishing.copy}</p>
        </div>
      </header>
      <OperationNotice
        language={language}
        operation={view.lastOperation}
        text={text.common}
      />
      <div className="grid">
        <section className="panel" aria-labelledby="publishing-create-title">
          <h2 className="panel-title" id="publishing-create-title">
            {text.pages.publishing.preparePackage}
          </h2>
          {packages.length === 0 ? (
            <div className="empty">
              {text.pages.publishing.noApprovedContent}
            </div>
          ) : null}
          <form
            className="form-stack"
            action="/api/local/publishing-preparation"
            method="post"
          >
            <label>
              {text.pages.publishing.approvedContent}
              <select className="field" name="contentPackageId" required>
                {packages.map((record) => (
                  <option key={record.id} value={record.id}>
                    {localizeRecordLabel(record.label, language)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {text.pages.publishing.destination}
              <input
                className="field"
                name="destination"
                placeholder="manual"
              />
            </label>
            <label>
              {text.pages.publishing.caption}
              <textarea
                className="field"
                name="caption"
                placeholder={text.pages.publishing.captionPlaceholder}
              />
            </label>
            <button
              className="button"
              type="submit"
              disabled={packages.length === 0}
            >
              {text.pages.publishing.prepareManualPackage}
            </button>
          </form>
        </section>
        <section className="panel" aria-labelledby="publishing-list-title">
          <h2 className="panel-title" id="publishing-list-title">
            {text.pages.publishing.manualPackages}
          </h2>
          {publishing.length > 0 ? (
            <div className="record-list">
              {publishing.map((record) => (
                <article className="record" key={record.id}>
                  <strong>{localizeRecordLabel(record.label, language)}</strong>
                  <div className="meta">{record.id}</div>
                  <div className="meta">
                    {text.common.state}:{" "}
                    {localizeValue(record.status, language)}
                  </div>
                  <div className="meta">
                    {text.common.next}:{" "}
                    {localizeValue(record.nextAction, language)}
                  </div>
                  {record.canComplete ? (
                    <form
                      className="inline-form"
                      action="/api/local/publishing-completion"
                      method="post"
                    >
                      <input
                        type="hidden"
                        name="publishingPackageId"
                        value={record.id}
                      />
                      <input
                        className="field"
                        name="manualPublishingReference"
                        placeholder={
                          text.pages.publishing.manualReferencePlaceholder
                        }
                      />
                      <button
                        className="button secondary compact"
                        type="submit"
                      >
                        {text.pages.publishing.recordComplete}
                      </button>
                    </form>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <div className="empty">
              {text.pages.publishing.noPublishingPackages}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
