import { DateValue } from "@/components/common/date-value";
import { StatusChip } from "@/components/common/status-chip";
import type { AuditLog } from "@/features/audit/types";
import {
  getAuditActionIcon,
  getAuditActionLabel,
  getAuditActionTone,
  getAuditEntityIcon,
  getAuditEntityLabel,
} from "@/features/audit/utils";

type AuditTimelineItemProps = {
  log: AuditLog;
};

export function AuditTimelineItem({ log }: AuditTimelineItemProps) {
  const EntityIcon = getAuditEntityIcon(log.entityType);
  const ActionIcon = getAuditActionIcon(log.action);

  return (
    <article className="relative pl-9">
      <div className="absolute left-0 top-0 flex size-10 items-center justify-center rounded-2xl bg-[#E8F8FB] text-[#00ABBD] ring-8 ring-white">
        <EntityIcon className="size-5" />
      </div>

      <div className="levdata-card rounded-[1.75rem] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <StatusChip
                label={getAuditEntityLabel(log.entityType)}
                tone="primary"
                dot={false}
              />

              <StatusChip
                label={getAuditActionLabel(log.action)}
                tone={getAuditActionTone(log.action)}
              />

              <span className="inline-flex items-center gap-1 rounded-full bg-[#F6FAFC] px-3 py-1 text-xs font-bold text-slate-500">
                <ActionIcon className="size-3.5" />
                {log.changedByName}
              </span>
            </div>

            <h2 className="mt-3 text-lg font-extrabold text-[#071B3A]">
              {log.entityName}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">{log.note}</p>

            {(log.oldValue || log.newValue) ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <ValueBox label="Antes" value={log.oldValue ?? "Sin valor previo"} />
                <ValueBox label="Después" value={log.newValue ?? "Sin valor nuevo"} />
              </div>
            ) : null}
          </div>

          <div className="shrink-0 rounded-2xl bg-[#F6FAFC] p-4 lg:min-w-52">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Fecha del cambio
            </p>
            <DateValue value={log.changedAt} className="mt-2" />
          </div>
        </div>
      </div>
    </article>
  );
}

type ValueBoxProps = {
  label: string;
  value: string;
};

function ValueBox({ label, value }: ValueBoxProps) {
  return (
    <div className="rounded-2xl bg-[#F6FAFC] p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-extrabold text-[#071B3A]">{value}</p>
    </div>
  );
}