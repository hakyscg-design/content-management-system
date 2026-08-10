import { AssetLibrary } from "./asset-library.js";
import { LocalActions } from "./local-actions.js";
import { OperationNotice } from "./operation-notice.js";
import { getOperatorDashboardView } from "./project-context.js";

export const dynamic = "force-dynamic";

export default async function Page() {
  const view = await getOperatorDashboardView();

  const assets = view.records.filter((record) => record.entityType === "Asset");

  return (
    <>
      <header className="page-header">
        <div>
          <h2 className="page-title">Operational Overview</h2>
          <p className="page-copy">
            Accepted production-layer areas are assembled into a local browser
            shell with local SQLite persistence and filesystem media storage.
          </p>
        </div>
      </header>
      <div className="notice">
        <strong>Persistent local runtime</strong>
        <div>
          {view.project.name} is active. {view.warning}
        </div>
      </div>
      <OperationNotice operation={view.lastOperation} />
      <div className="grid">
        <section className="panel" aria-labelledby="records-title">
          <h2 className="panel-title" id="records-title">
            Asset Library
          </h2>
          <AssetLibrary assets={assets} />
        </section>

        <section className="panel" aria-labelledby="media-title">
          <h2 className="panel-title" id="media-title">
            Local media
          </h2>

          {view.media.length > 0 ? (
            <div className="record-list">
              {view.media.map((media) => (
                <article className="record" key={media.id}>
                  <strong>{media.fileName}</strong>
                  <div className="meta">{media.relativePath}</div>
                  <div className="meta">{media.byteSize} bytes</div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty">No local media is stored yet.</div>
          )}
        </section>

        <LocalActions />
      </div>
    </>
  );
}
