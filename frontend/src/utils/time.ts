import { format } from 'date-fns';

export const natoDateTime = 'ddHHmmLLLyy';
export function formatNatoDateTime<DateType extends Date>(
  dateTime: DateType | number | string | undefined,
): string | undefined {
  if (!dateTime) {
    return undefined;
  }
  return format(dateTime, natoDateTime);
}