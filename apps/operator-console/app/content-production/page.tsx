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
  const assets = view.executionFlow.assets.filter(
    (record) => record.canCreateContent
  );
  const packages = view.executionFlow.contentPackages;

  return (
    <>
      <header className="page-header">
        <div>
          <h2 className="page-title">{text.pages.contentProduction.title}</h2>
          <p className="page-copy">{text.pages.contentProduction.copy}</p>
        </div>
      </header>
      <OperationNotice
        language={language}
        operation={view.lastOperation}
        text={text.common}
      />
      <div className="grid">
        <section className="panel" aria-labelledby="content-create-title">
          <h2 className="panel-title" id="content-create-title">
            {text.pages.contentProduction.createPackage}
          </h2>
          {assets.length === 0 ? (
            <div className="empty">
              {text.pages.contentProduction.noReadyAssets}
            </div>
          ) : null}
          <form
            className="form-stack"
            action="/api/local/content-production"
            method="post"
          >
            <label>
              {text.pages.contentProduction.asset}
              <select className="field" name="assetId" required>
                {assets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {localizeRecordLabel(asset.label, language)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {text.pages.contentProduction.packageTitle}
              <input
                className="field"
                name="title"
                placeholder={text.pages.contentProduction.titlePlaceholder}
              />
            </label>
            <label>
              {text.pages.contentProduction.concept}
              <textarea
                className="field"
                name="concept"
                placeholder={text.pages.contentProduction.conceptPlaceholder}
              />
            </label>
            <label>
              {text.pages.contentProduction.caption}
              <textarea
                className="field"
                name="caption"
                placeholder={text.pages.contentProduction.captionPlaceholder}
              />
            </label>
            <button
              className="button"
              type="submit"
              disabled={assets.length === 0}
            >
              {text.pages.contentProduction.createContentPackage}
            </button>
          </form>
        </section>

        <section className="panel" aria-labelledby="content-list-title">
          <h2 className="panel-title" id="content-list-title">
            {text.pages.contentProduction.packages}
          </h2>
          <RecordList
            language={language}
            records={packages}
            empty={text.pages.contentProduction.noPackages}
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
    readonly nextAction: string;
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
          <strong>{localizeRecordLabel(record.label, language)}</strong>
          <div className="meta">{record.id}</div>
          <div className="meta">
            {text.common.state}: {localizeValue(record.status, language)}
          </div>
          <div className="meta">
            {text.common.next}: {localizeValue(record.nextAction, language)}
          </div>
        </article>
      ))}
    </div>
  );
}
