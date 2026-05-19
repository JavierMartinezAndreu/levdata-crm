import { ActivitiesClientPage } from "@/features/activities/components/activities-client-page";
import { mockActivities } from "@/features/activities/data/mock-activities";

export default function ActivitiesPage() {
  return <ActivitiesClientPage activities={mockActivities} />;
}