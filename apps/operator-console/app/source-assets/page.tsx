import { SectionPage } from "../section-page";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <SectionPage
      title="Source & Assets"
      description="Manual source intake, asset registration, provenance, rights status, and duplicate-aware asset readiness."
      route="/source-assets"
    />
  );
}
