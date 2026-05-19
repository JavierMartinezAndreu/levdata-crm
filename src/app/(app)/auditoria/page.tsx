import { AuditClientPage } from "@/features/audit/components/audit-client-page";
import { mockAuditLogs } from "@/features/audit/data/mock-audit";

export default function AuditPage() {
  return <AuditClientPage logs={mockAuditLogs} />;
}