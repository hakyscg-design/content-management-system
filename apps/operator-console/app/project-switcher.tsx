import { listOperatorProjects } from "./project-context.js";

interface ProjectSwitcherProps {
  readonly activeProjectId: string;
}

export function ProjectSwitcher({ activeProjectId }: ProjectSwitcherProps) {
  const projects = listOperatorProjects();

  return (
    <form
      className="project-switcher"
      action="/api/local/project"
      method="post"
      aria-label="Active CMS project"
    >
      <label className="project-label" htmlFor="project-id">
        Active project
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
        Switch
      </button>
    </form>
  );
}
