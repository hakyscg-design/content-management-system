import { SectionPage } from "../section-page";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <SectionPage
      title="Review"
      description="Human review remains authoritative for assignments, decisions, and approval status."
      route="/review"
    />
  );
}
