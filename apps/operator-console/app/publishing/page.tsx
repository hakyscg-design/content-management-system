import { SectionPage } from "../section-page";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <SectionPage
      title="Publishing"
      description="Publishing preparation creates manual publishing packages only; autonomous posting remains excluded."
      route="/publishing"
    />
  );
}
