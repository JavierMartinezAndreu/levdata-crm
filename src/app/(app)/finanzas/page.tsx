import { FinanceClientPage } from "@/features/finance/components/finance-client-page";
import {
  mockExpenses,
  mockPayments,
  mockPayouts,
} from "@/features/finance/data/mock-finance";

export default function FinancePage() {
  return (
    <FinanceClientPage
      payments={mockPayments}
      expenses={mockExpenses}
      payouts={mockPayouts}
    />
  );
}