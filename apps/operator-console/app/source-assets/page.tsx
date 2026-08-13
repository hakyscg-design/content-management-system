import { getOperatorLanguage } from "../language-context.js";
import { OperationNotice } from "../operation-notice.js";
import { getOperatorDashboardView } from "../project-context.js";
import {
  copy,
  localizeRecordLabel,
  localizeValue,
  type OperatorCopy,
  type OperatorLanguage
} from "../i18n.js";

export const dynamic = "force-dynamic";

export default async function Page() {
  const view = await getOperatorDashboardView();
  const language = await getOperatorLanguage();
  const text = copy[language];
  const assets = view.executionFlow.assets;

  return (
    <>
      <header className="page-header">
        <div>
          <h2 className="page-title">{text.pages.sourceAssets.title}</h2>
          <p className="page-copy">{text.pages.sourceAssets.copy}</p>
        </div>
      </header>
      <OperationNotice
        language={language}
        operation={view.lastOperation}
        text={text.common}
      />
      <div className="grid">
        <section className="panel" aria-labelledby="asset-create-title">
          <h2 className="panel-title" id="asset-create-title">
            {text.pages.sourceAssets.registerAsset}
          </h2>
          <form
            className="form-stack"
            action="/api/local/asset-intake"
            method="post"
          >
            <label>
              {text.pages.sourceAssets.sourceUrl}
              <input
                className="field"
                name="sourceUrl"
                placeholder={text.pages.sourceAssets.sourceUrlPlaceholder}
              />
            </label>
            <label>
              {text.pages.sourceAssets.assetLabel}
              <input
                className="field"
                name="label"
                placeholder={text.pages.sourceAssets.assetLabelPlaceholder}
              />
            </label>
            <label>
              {text.pages.sourceAssets.evidence}
              <textarea
                className="field"
                name="evidence"
                placeholder={text.pages.sourceAssets.evidencePlaceholder}
              />
            </label>
            <button className="button" type="submit">
              {text.pages.sourceAssets.registerReadyAsset}
            </button>
          </form>
        </section>
        <section className="panel" aria-labelledby="asset-list-title">
          <h2 className="panel-title" id="asset-list-title">
            {text.pages.sourceAssets.readyAssets}
          </h2>
          <RecordList
            language={language}
            records={assets}
            empty={text.pages.sourceAssets.noAssets}
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
