import { getOperatorDashboardView } from "../project-context.js";

export const dynamic = "force-dynamic";

export default async function Page() {
  const view = await getOperatorDashboardView();
  const administration = view.administration;

  return (
    <>
      <header className="page-header">
        <div>
          <h2 className="page-title">Administration</h2>
          <p className="page-copy">
            Manage CMS-owned project settings and local runtime operations
            without taking ownership of content, publishing, review,
            performance, or workflow business records.
          </p>
        </div>
      </header>

      {view.lastOperation ? (
        <div
          className={`notice ${view.lastOperation.ok ? "success" : "error"}`}
        >
          <strong>{view.lastOperation.title}</strong>
          <div>{view.lastOperation.message}</div>
        </div>
      ) : null}

      <div className="grid">
        <section className="panel" aria-labelledby="project-title">
          <h2 className="panel-title" id="project-title">
            Canonical Project Configuration
          </h2>
          <div className="record-list">
            <article className="record">
              <strong>{administration.canonicalProjectProfile.name}</strong>
              <div className="meta">
                ID: {administration.canonicalProjectProfile.id}
              </div>
              <div className="meta">
                Slug: {administration.canonicalProjectProfile.slug}
              </div>
              <div className="meta">
                Namespace:{" "}
                {administration.canonicalProjectProfile.serviceNamespace}
              </div>
              <div className="meta">
                Profile: {administration.canonicalProjectProfile.profilePath}
              </div>
              <div className="meta">
                This registry-backed identity is read-only in Administration.
              </div>
            </article>
          </div>
        </section>

        <section className="panel" aria-labelledby="settings-title">
          <h2 className="panel-title" id="settings-title">
            Local Operator Preferences
          </h2>
          <div className="meta">
            {administration.projectSettings.description}
          </div>
          <form
            className="form-stack"
            action="/api/local/administration"
            method="post"
          >
            <input name="action" type="hidden" value="update-settings" />
            <label>
              Operator label
              <input
                className="field"
                maxLength={80}
                name="operatorLabel"
                defaultValue={administration.projectSettings.operatorLabel}
              />
            </label>
            <label>
              Default locale
              <input
                className="field"
                maxLength={20}
                name="defaultLocale"
                pattern="[A-Za-z]{2,3}(-[A-Za-z0-9]{2,8})*"
                defaultValue={administration.projectSettings.defaultLocale}
              />
            </label>
            <label>
              Policy note
              <textarea
                className="field"
                maxLength={240}
                name="policyNote"
                defaultValue={administration.projectSettings.policyNote}
              />
            </label>
            {administration.projectSettings.updatedAt ? (
              <div className="meta">
                Last updated: {administration.projectSettings.updatedAt}
              </div>
            ) : null}
            <button className="button" type="submit">
              Save Project Settings
            </button>
          </form>
        </section>

        <section className="panel" aria-labelledby="global-title">
          <h2 className="panel-title" id="global-title">
            Global CMS Settings
          </h2>
          <div className="meta">
            {administration.globalSettings.description}
          </div>
          <div className="record-list">
            <article className="record">
              <strong>{administration.globalSettings.runtimeKind}</strong>
              <div className="meta">
                Scope: {administration.globalSettings.scope}
              </div>
              <div className="meta">
                Schema: {administration.globalSettings.schemaVersion}
              </div>
              <div className="meta">
                Migration: {administration.globalSettings.migrationVersion}
              </div>
              <div className="meta">
                Environment: {administration.globalSettings.environment}
              </div>
              <div className="meta">
                Log level: {administration.globalSettings.logLevel}
              </div>
              <div className="meta">
                Known projects:{" "}
                {administration.globalSettings.knownProjects.join(", ")}
              </div>
            </article>
          </div>
        </section>

        <section className="panel" aria-labelledby="health-title">
          <h2 className="panel-title" id="health-title">
            Runtime Health
          </h2>
          <article className="record">
            <strong>{administration.health.status}</strong>
            <div className="meta">{administration.health.message}</div>
            <div className="meta">
              Records: {administration.health.recordCount}
            </div>
            <div className="meta">
              Media: {administration.health.mediaCount}
            </div>
            <div className="meta">
              Recent failures: {administration.health.recentFailureCount}
            </div>
          </article>
        </section>

        <section className="panel" aria-labelledby="storage-title">
          <h2 className="panel-title" id="storage-title">
            Project-Scoped Local Storage
          </h2>
          <article className="record">
            <strong>
              Database{" "}
              {administration.storage.databaseExists ? "ready" : "missing"}
            </strong>
            <div className="meta">Scope: {administration.storage.scope}</div>
            <div className="meta">Base: {administration.storage.baseDir}</div>
            <div className="meta">
              Database: {administration.storage.databasePath}
            </div>
            <div className="meta">
              Database bytes: {administration.storage.databaseBytes}
            </div>
            <div className="meta">Media: {administration.storage.mediaDir}</div>
            <div className="meta">
              Media bytes: {administration.storage.mediaBytes}
            </div>
            <div className="meta">
              Backups: {administration.storage.backupCount}
            </div>
          </article>
        </section>

        <section className="panel" aria-labelledby="backup-title">
          <h2 className="panel-title" id="backup-title">
            Project Backup And Restore
          </h2>
          <div className="meta">
            Backup visibility is filtered to the active project. Global backup
            policy is read-only here.
          </div>
          <form
            className="inline-form"
            action="/api/local/administration"
            method="post"
          >
            <input name="action" type="hidden" value="create-backup" />
            <button className="button" type="submit">
              Create Local Backup
            </button>
          </form>
          <div className="meta">{administration.restoreGuidance}</div>
          {administration.backups.length > 0 ? (
            <div className="record-list">
              {administration.backups.map((backup) => (
                <article className="record" key={backup.path}>
                  <strong>{backup.name}</strong>
                  <div className="meta">{backup.path}</div>
                  <div className="meta">Created: {backup.createdAt}</div>
                  <div className="meta">
                    Manifest: {backup.hasManifest ? "present" : "missing"}
                  </div>
                  {backup.projectId ? (
                    <div className="meta">Project: {backup.projectId}</div>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <div className="empty">No local backups are recorded yet.</div>
          )}
        </section>
      </div>
    </>
  );
}
