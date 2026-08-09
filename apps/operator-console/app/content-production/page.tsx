import { getOperatorDashboardView } from "../project-context.js";

export const dynamic = "force-dynamic";

export default async function Page() {
  const view = await getOperatorDashboardView();
  const assets = view.executionFlow.assets.filter(
    (record) => record.canCreateContent
  );
  const packages = view.executionFlow.contentPackages;

  return (
    <>
      <header className="page-header">
        <div>
          <h2 className="page-title">Content Production</h2>
          <p className="page-copy">
            Create manual content packages from ready source assets, then mark
            versions ready for human review.
          </p>
        </div>
      </header>
      <div className="grid">
        <section className="panel" aria-labelledby="content-create-title">
          <h2 className="panel-title" id="content-create-title">
            Create package
          </h2>
          {assets.length === 0 ? (
            <div className="empty">
              No ready assets are waiting for content production.
            </div>
          ) : null}
          <form
            className="form-stack"
            action="/api/local/content-production"
            method="post"
          >
            <label>
              Asset
              <select className="field" name="assetId" required>
                {assets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Title
              <input
                className="field"
                name="title"
                placeholder="Manual brief title"
              />
            </label>
            <label>
              Concept
              <textarea
                className="field"
                name="concept"
                placeholder="Manual content concept"
              />
            </label>
            <label>
              Caption
              <textarea
                className="field"
                name="caption"
                placeholder="Draft caption"
              />
            </label>
            <button
              className="button"
              type="submit"
              disabled={assets.length === 0}
            >
              Create Content Package
            </button>
          </form>
        </section>

        <section className="panel" aria-labelledby="content-list-title">
          <h2 className="panel-title" id="content-list-title">
            Packages
          </h2>
          <RecordList records={packages} empty="No content packages yet." />
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
    readonly nextAction: string;
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
          <div className="meta">Next: {record.nextAction}</div>
        </article>
      ))}
    </div>
  );
}
