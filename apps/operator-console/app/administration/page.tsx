import { SectionPage } from "../section-page.js";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <SectionPage
      title="Administration"
      description="Core data administration provides non-authoritative visibility and governance support without owning business records."
      route="/administration"
    />
  );
}
