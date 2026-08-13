import { copy, localizeValue } from "../i18n.js";
import { getOperatorLanguage } from "../language-context.js";
import { OperationNotice } from "../operation-notice.js";
import { getOperatorDashboardView } from "../project-context.js";

export const dynamic = "force-dynamic";

export default async function Page() {
  const view = await getOperatorDashboardView();
  const language = await getOperatorLanguage();
  const text = copy[language];
  const administration = view.administration;

  return (
    <>
      <header className="page-header">
        <div>
          <h2 className="page-title">{text.pages.administration.title}</h2>
          <p className="page-copy">{text.pages.administration.copy}</p>
        </div>
      </header>

      <OperationNotice
        language={language}
        operation={view.lastOperation}
        text={text.common}
      />

      <div className="grid">
        <section className="panel" aria-labelledby="project-title">
          <h2 className="panel-title" id="project-title">
            {text.pages.administration.canonical}
          </h2>
          <div className="record-list">
            <article className="record">
              <strong>{administration.canonicalProjectProfile.name}</strong>
              <div className="meta">
                {text.common.id}: {administration.canonicalProjectProfile.id}
              </div>
              <div className="meta">
                {text.pages.administration.slug}:{" "}
                {administration.canonicalProjectProfile.slug}
              </div>
              <div className="meta">
                {text.pages.administration.namespace}:{" "}
                {administration.canonicalProjectProfile.serviceNamespace}
              </div>
              <div className="meta">
                {text.pages.administration.profile}:{" "}
                {administration.canonicalProjectProfile.profilePath}
              </div>
              <div className="meta">
                {text.pages.administration.readOnlyIdentity}
              </div>
            </article>
          </div>
        </section>

        <section className="panel" aria-labelledby="settings-title">
          <h2 className="panel-title" id="settings-title">
            {text.pages.administration.preferences}
          </h2>
          <div className="meta">
            {localizeValue(
              administration.projectSettings.description,
              language
            )}
          </div>
          <form
            className="form-stack"
            action="/api/local/administration"
            method="post"
          >
            <input name="action" type="hidden" value="update-settings" />
            <label>
              {text.pages.administration.operatorLabel}
              <input
                className="field"
                maxLength={80}
                name="operatorLabel"
                defaultValue={administration.projectSettings.operatorLabel}
              />
            </label>
            <label>
              {text.pages.administration.defaultLocale}
              <input
                className="field"
                maxLength={20}
                name="defaultLocale"
                pattern="[A-Za-z]{2,3}(-[A-Za-z0-9]{2,8})*"
                defaultValue={administration.projectSettings.defaultLocale}
              />
            </label>
            <label>
              {text.pages.administration.policyNote}
              <textarea
                className="field"
                maxLength={240}
                name="policyNote"
                defaultValue={administration.projectSettings.policyNote}
              />
            </label>
            {administration.projectSettings.updatedAt ? (
              <div className="meta">
                {text.pages.administration.lastUpdated}:{" "}
                {administration.projectSettings.updatedAt}
              </div>
            ) : null}
            <button className="button" type="submit">
              {text.pages.administration.saveProjectSettings}
            </button>
          </form>
        </section>

        <section className="panel" aria-labelledby="global-title">
          <h2 className="panel-title" id="global-title">
            {text.pages.administration.globalSettings}
          </h2>
          <div className="meta">
            {localizeValue(administration.globalSettings.description, language)}
          </div>
          <div className="record-list">
            <article className="record">
              <strong>{administration.globalSettings.runtimeKind}</strong>
              <div className="meta">
                {text.common.scope}: {administration.globalSettings.scope}
              </div>
              <div className="meta">
                {text.pages.administration.schema}:{" "}
                {administration.globalSettings.schemaVersion}
              </div>
              <div className="meta">
                {text.pages.administration.migration}:{" "}
                {administration.globalSettings.migrationVersion}
              </div>
              <div className="meta">
                {text.pages.administration.environment}:{" "}
                {administration.globalSettings.environment}
              </div>
              <div className="meta">
                {text.pages.administration.logLevel}:{" "}
                {administration.globalSettings.logLevel}
              </div>
              <div className="meta">
                {text.pages.administration.knownProjects}:{" "}
                {administration.globalSettings.knownProjects.join(", ")}
              </div>
            </article>
          </div>
        </section>

        <section className="panel" aria-labelledby="health-title">
          <h2 className="panel-title" id="health-title">
            {text.pages.administration.runtimeHealth}
          </h2>
          <article className="record">
            <strong>
              {localizeValue(administration.health.status, language)}
            </strong>
            <div className="meta">
              {localizeValue(administration.health.message, language)}
            </div>
            <div className="meta">
              {text.pages.administration.records}:{" "}
              {administration.health.recordCount}
            </div>
            <div className="meta">
              {text.pages.administration.media}:{" "}
              {administration.health.mediaCount}
            </div>
            <div className="meta">
              {text.pages.administration.recentFailures}:{" "}
              {administration.health.recentFailureCount}
            </div>
          </article>
        </section>

        <section className="panel" aria-labelledby="storage-title">
          <h2 className="panel-title" id="storage-title">
            {text.pages.administration.storage}
          </h2>
          <article className="record">
            <strong>
              {text.pages.administration.database}{" "}
              {administration.storage.databaseExists
                ? text.pages.administration.ready
                : text.common.missing}
            </strong>
            <div className="meta">
              {text.common.scope}: {administration.storage.scope}
            </div>
            <div className="meta">
              {text.pages.administration.base}: {administration.storage.baseDir}
            </div>
            <div className="meta">
              {text.pages.administration.database}:{" "}
              {administration.storage.databasePath}
            </div>
            <div className="meta">
              {text.pages.administration.databaseBytes}:{" "}
              {administration.storage.databaseBytes}
            </div>
            <div className="meta">
              {text.pages.administration.media}:{" "}
              {administration.storage.mediaDir}
            </div>
            <div className="meta">
              {text.pages.administration.mediaBytes}:{" "}
              {administration.storage.mediaBytes}
            </div>
            <div className="meta">
              {text.pages.administration.backups}:{" "}
              {administration.storage.backupCount}
            </div>
          </article>
        </section>

        <section className="panel" aria-labelledby="backup-title">
          <h2 className="panel-title" id="backup-title">
            {text.pages.administration.backupRestore}
          </h2>
          <div className="meta">{text.pages.administration.backupGuidance}</div>
          <form
            className="inline-form"
            action="/api/local/administration"
            method="post"
          >
            <input name="action" type="hidden" value="create-backup" />
            <button className="button" type="submit">
              {text.pages.administration.createBackup}
            </button>
          </form>
          <div className="meta">
            {localizeValue(administration.restoreGuidance, language)}
          </div>
          {administration.backups.length > 0 ? (
            <div className="record-list">
              {administration.backups.map((backup) => (
                <article className="record" key={backup.path}>
                  <strong>{backup.name}</strong>
                  <div className="meta">{backup.path}</div>
                  <div className="meta">
                    {text.common.created}: {backup.createdAt}
                  </div>
                  <div className="meta">
                    {text.common.manifest}:{" "}
                    {backup.hasManifest
                      ? text.common.present
                      : text.common.missing}
                  </div>
                  {backup.projectId ? (
                    <div className="meta">
                      {text.common.project}: {backup.projectId}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <div className="empty">{text.pages.administration.noBackups}</div>
          )}
        </section>
      </div>
    </>
  );
}
