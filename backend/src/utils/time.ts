import { format } from 'date-fns';

export const natoDateTime = 'ddHHmmLLLyy';

export function formatNatoDateTime<DateType extends Date>(
  dateTime?: DateType | number | string,
): string {
  if (!dateTime) {
    return '';
  }
  return format(dateTime, natoDateTime);
}
