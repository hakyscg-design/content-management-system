import { SectionPage } from "../section-page.js";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <SectionPage
      title="Workflow"
      description="Visible workflow runs coordinate owner-service commands without owning target state."
      route="/workflow"
    />
  );
}
