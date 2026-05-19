import { MaintenanceClientPage } from "@/features/maintenance/components/maintenance-client-page";
import {
  mockMaintenanceContracts,
  mockMaintenanceDues,
} from "@/features/maintenance/data/mock-maintenance";

export default function MaintenancePage() {
  return (
    <MaintenanceClientPage
      contracts={mockMaintenanceContracts}
      dues={mockMaintenanceDues}
    />
  );
}