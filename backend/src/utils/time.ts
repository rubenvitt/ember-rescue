import { format } from 'date-fns';

export const natoDateTime = 'ddHHmmLLLyy';

export function formatNatoDateTime<DateType extends Date>(
  dateTime: DateType | number | string,
): string {
  return format(dateTime, natoDateTime);
}
