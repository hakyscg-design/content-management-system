import { copy, localizeValue } from "./i18n.js";
import { getOperatorLanguage } from "./language-context.js";
import { getOperatorDashboardView } from "./project-context.js";

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
  const view = await getOperatorDashboardView();
  const language = await getOperatorLanguage();
  const text = copy[language].pages.traceability;
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
            {text.title}
          </h2>
          <div className="record">
            <strong>{localizeValue(trace.capability, language)}</strong>
            <div className="meta">
              {text.owner}: {trace.owningService}
            </div>
            <div className="meta">
              {text.status}: {localizeValue(trace.status, language)}
            </div>
          </div>
        </section>
      ) : (
        <div className="empty">{text.empty}</div>
      )}
    </>
  );
}
