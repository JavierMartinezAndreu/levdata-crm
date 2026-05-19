export type AuditEntityType =
  | "company"
  | "contact"
  | "opportunity"
  | "activity"
  | "project"
  | "sprint"
  | "feature"
  | "payment"
  | "expense"
  | "payout"
  | "maintenance"
  | "user"
  | "settings";

export type AuditAction =
  | "created"
  | "updated"
  | "statusChanged"
  | "deleted"
  | "completed"
  | "cancelled"
  | "paymentRegistered"
  | "expenseRegistered"
  | "payoutRegistered"
  | "maintenancePaused"
  | "maintenanceResumed"
  | "periodForgiven";

export type AuditLog = {
  id: string;
  entityType: AuditEntityType;
  entityId: string;
  entityName: string;
  action: AuditAction;
  oldValue: string | null;
  newValue: string | null;
  changedById: string;
  changedByName: string;
  changedAt: string;
  note: string;
};