import { ProjectsClientPage } from "@/features/projects/components/projects-client-page";
import {
  mockFeatures,
  mockProjects,
  mockSprints,
} from "@/features/projects/data/mock-projects";

export default function ProjectsPage() {
  return (
    <ProjectsClientPage
      projects={mockProjects}
      sprints={mockSprints}
      features={mockFeatures}
    />
  );
}