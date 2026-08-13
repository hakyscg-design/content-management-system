import type { OperatorCopy } from "./i18n.js";
import { listOperatorProjects } from "./project-context.js";

interface ProjectSwitcherProps {
  readonly activeProjectId: string;
  readonly text: OperatorCopy["shell"];
}

export function ProjectSwitcher({
  activeProjectId,
  text
}: ProjectSwitcherProps) {
  const projects = listOperatorProjects();

  return (
    <form
      className="project-switcher"
      action="/api/local/project"
      method="post"
      aria-label={text.projectAria}
    >
      <label className="project-label" htmlFor="project-id">
        {text.projectLabel}
      </label>
      <select
        className="project-select"
        id="project-id"
        name="projectId"
        defaultValue={activeProjectId}
      >
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
      <button className="button secondary compact" type="submit">
        {text.projectSwitch}
      </button>
    </form>
  );
}
