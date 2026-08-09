import { getOperatorDashboardView } from "../project-context.js";

export const dynamic = "force-dynamic";

export default async function Page() {
  const view = await getOperatorDashboardView();
  const packages = view.records.filter(
    (record) => record.entityType === "ContentPackage"
  );
  const publishing = view.records.filter(
    (record) => record.entityType === "PublishingPackage"
  );

  return (
    <>
      <header className="page-header">
        <div>
          <h2 className="page-title">Publishing</h2>
          <p className="page-copy">
            Prepare manual publishing packages through FTV-SVC-04. No autonomous
            platform publishing is performed.
          </p>
        </div>
      </header>
      <div className="grid">
        <section className="panel" aria-labelledby="publishing-create-title">
          <h2 className="panel-title" id="publishing-create-title">
            Prepare package
          </h2>
          <form
            className="form-stack"
            action="/api/local/publishing-preparation"
            method="post"
          >
            <label>
              Approved content
              <select className="field" name="contentPackageId" required>
                {packages.map((record) => (
                  <option key={record.id} value={record.id}>
                    {record.label} ({record.status})
                  </option>
                ))}
              </select>
            </label>
            <label>
              Destination
              <input
                className="field"
                name="destination"
                placeholder="manual"
              />
            </label>
            <label>
              Caption
              <textarea
                className="field"
                name="caption"
                placeholder="Final manual caption"
              />
            </label>
            <button
              className="button"
              type="submit"
              disabled={packages.length === 0}
            >
              Prepare Manual Package
            </button>
          </form>
        </section>
        <section className="panel" aria-labelledby="publishing-list-title">
          <h2 className="panel-title" id="publishing-list-title">
            Manual packages
          </h2>
          {publishing.length > 0 ? (
            <div className="record-list">
              {publishing.map((record) => (
                <article className="record" key={record.id}>
                  <strong>{record.label}</strong>
                  <div className="meta">{record.id}</div>
                  <div className="meta">
                    {record.ownerServiceId} - {record.status}
                  </div>
                  {record.status === "ready" ? (
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
                        placeholder="manual://published/reference"
                      />
                      <button
                        className="button secondary compact"
                        type="submit"
                      >
                        Record Complete
                      </button>
                    </form>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <div className="empty">No publishing packages yet.</div>
          )}
        </section>
      </div>
    </>
  );
}
