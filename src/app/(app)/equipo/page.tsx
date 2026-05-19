import { TeamClientPage } from "@/features/users/components/team-client-page";
import { mockUsers } from "@/features/users/data/mock-users";

export default function TeamPage() {
  return <TeamClientPage users={mockUsers} />;
}