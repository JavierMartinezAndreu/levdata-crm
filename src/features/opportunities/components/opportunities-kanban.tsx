import { MoneyValue } from "@/components/common/money-value";
import { OpportunityCard } from "@/features/opportunities/components/opportunity-card";
import type { Opportunity } from "@/features/opportunities/types";
import { groupOpportunitiesByStatus } from "@/features/opportunities/utils";

type OpportunitiesKanbanProps = {
  opportunities: Opportunity[];
};

export function OpportunitiesKanban({ opportunities }: OpportunitiesKanbanProps) {
  const groups = groupOpportunitiesByStatus(opportunities).filter(
    (group) => group.opportunities.length > 0,
  );

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {groups.map((group) => {
        const total = group.opportunities.reduce(
          (sum, opportunity) => sum + opportunity.valorEstimado,
          0,
        );

        return (
          <section
            key={group.status}
            className="min-w-[320px] max-w-[320px] rounded-[1.75rem] border border-[#DCEAF1]/80 bg-white/70 p-4 shadow-sm"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="font-extrabold text-[#071B3A]">{group.label}</h2>
                <p className="mt-1 text-xs font-semibold text-slate-400">
                  {group.opportunities.length} oportunidades
                </p>
              </div>

              <MoneyValue value={total} size="sm" />
            </div>

            <div className="space-y-3">
              {group.opportunities.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  compact
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}