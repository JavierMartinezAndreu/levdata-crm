import { format, isToday, isTomorrow, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export function formatDate(value: string | Date): string {
  const date = typeof value === "string" ? parseISO(value) : value;

  return format(date, "d MMM yyyy", {
    locale: es,
  });
}

export function formatDateTime(value: string | Date): string {
  const date = typeof value === "string" ? parseISO(value) : value;

  return format(date, "d MMM yyyy, HH:mm", {
    locale: es,
  });
}

export function formatHumanDate(value: string | Date): string {
  const date = typeof value === "string" ? parseISO(value) : value;

  if (isToday(date)) return "Hoy";
  if (isTomorrow(date)) return "Mañana";

  return formatDate(date);
}