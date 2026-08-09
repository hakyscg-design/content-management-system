import { getOperatorDashboardView } from "../project-context.js";

export const dynamic = "force-dynamic";

export default async function Page() {
  const view = await getOperatorDashboardView();
  const assets = view.records.filter((record) => record.entityType === "Asset");

  return (
    <>
      <header className="page-header">
        <div>
          <h2 className="page-title">Source & Assets</h2>
          <p className="page-copy">
            Capture approved manual sources and register ready assets through
            FTV-SVC-01.
          </p>
        </div>
      </header>
      <div className="grid">
        <section className="panel" aria-labelledby="asset-create-title">
          <h2 className="panel-title" id="asset-create-title">
            Register asset
          </h2>
          <form
            className="form-stack"
            action="/api/local/asset-intake"
            method="post"
          >
            <label>
              Source URL
              <input
                className="field"
                name="sourceUrl"
                placeholder="manual://source or https://..."
              />
            </label>
            <label>
              Asset label
              <input
                className="field"
                name="label"
                placeholder="Operator-facing asset label"
              />
            </label>
            <label>
              Evidence
              <textarea
                className="field"
                name="evidence"
                placeholder="Manual provenance or rights evidence"
              />
            </label>
            <button className="button" type="submit">
              Register Ready Asset
            </button>
          </form>
        </section>
        <section className="panel" aria-labelledby="asset-list-title">
          <h2 className="panel-title" id="asset-list-title">
            Ready assets
          </h2>
          <RecordList records={assets} empty="No assets are registered yet." />
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
    readonly ownerServiceId: string;
    readonly status: string;
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
          <div className="meta">
            {record.ownerServiceId} - {record.status}
          </div>
        </article>
      ))}
    </div>
  );
}
