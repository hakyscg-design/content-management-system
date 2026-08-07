import { getLocalDashboardView } from "@ftv/local-runtime";

interface SectionPageProps {
  readonly title: string;
  readonly description: string;
  readonly route: string;
}

export async function SectionPage({
  title,
  description,
  route
}: SectionPageProps) {
  const view = await getLocalDashboardView();
  const trace = view.routes.find((item) => item.route === route);

  return (
    <>
      <header className="page-header">
        <div>
          <h2 className="page-title">{title}</h2>
          <p className="page-copy">{description}</p>
        </div>
      </header>
      {trace ? (
        <section className="panel" aria-labelledby="trace-title">
          <h2 className="panel-title" id="trace-title">
            Route traceability
          </h2>
          <div className="record">
            <strong>{trace.capability}</strong>
            <div className="meta">Owner: {trace.owningService}</div>
            <div className="meta">Status: {trace.status}</div>
          </div>
        </section>
      ) : (
        <div className="empty">No traceability row exists for this route.</div>
      )}
    </>
  );
}
