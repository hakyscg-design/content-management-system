import { cookies } from "next/headers";
import {
  getLocalDashboardView,
  listLocalProjects,
  type LocalRuntimeOptions
} from "@ftv/local-runtime";
import { OPERATOR_PROJECT_COOKIE } from "./project-cookie.js";

export async function getOperatorProjectId(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(OPERATOR_PROJECT_COOKIE)?.value;
}

export async function getOperatorRuntimeOptions(): Promise<LocalRuntimeOptions> {
  const projectId = await getOperatorProjectId();
  const known = listLocalProjects().some((project) => project.id === projectId);
  return projectId && known ? { projectId } : {};
}

export async function getOperatorDashboardView() {
  return getLocalDashboardView(await getOperatorRuntimeOptions());
}

export function listOperatorProjects() {
  return listLocalProjects();
}
