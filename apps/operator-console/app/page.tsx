import { AssetLibrary } from "./asset-library.js";
import { getOperatorLanguage } from "./language-context.js";
import { LocalActions } from "./local-actions.js";
import { OperationNotice } from "./operation-notice.js";
import { getOperatorDashboardView } from "./project-context.js";
import { copy, localizeValue } from "./i18n.js";

export const dynamic = "force-dynamic";

export default async function Page() {
  const view = await getOperatorDashboardView();
  const language = await getOperatorLanguage();
  const text = copy[language];

  const assets = view.records.filter((record) => record.entityType === "Asset");

  return (
    <>
      <header className="page-header">
        <div>
          <h2 className="page-title">{text.pages.overview.title}</h2>
          <p className="page-copy">{text.pages.overview.copy}</p>
        </div>
      </header>
      <div className="notice">
        <strong>{text.pages.overview.noticeTitle}</strong>
        <div>
          {view.project.name} {text.pages.overview.active}{" "}
          {localizeValue(view.warning, language)}
        </div>
      </div>
      <OperationNotice
        language={language}
        operation={view.lastOperation}
        text={text.common}
      />
      <div className="grid">
        <section className="panel" aria-labelledby="records-title">
          <h2 className="panel-title" id="records-title">
            {text.pages.overview.assetLibrary}
          </h2>
          <AssetLibrary assets={assets} language={language} text={text} />
        </section>

        <section className="panel" aria-labelledby="media-title">
          <h2 className="panel-title" id="media-title">
            {text.pages.overview.localMedia}
          </h2>

          {view.media.length > 0 ? (
            <div className="record-list">
              {view.media.map((media) => (
                <article className="record" key={media.id}>
                  <strong>{media.fileName}</strong>
                  <div className="meta">{media.relativePath}</div>
                  <div className="meta">
                    {media.byteSize} {text.common.bytes}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty">{text.pages.overview.noMedia}</div>
          )}
        </section>

        <LocalActions language={language} text={text} />
      </div>
    </>
  );
}
