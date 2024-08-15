import { format } from 'date-fns';
import { Dayjs, isDayjs } from 'dayjs';

export const natoDateTime = 'ddHHmmLLLyy';
export const natoDateTimeAnt = 'DDHHmmMMMYY';

export function formatNatoDateTime<DateType extends Date>(
  dateTime: DateType | Dayjs | number | string | undefined,
): string | undefined {
  if (!dateTime) {
    return undefined;
  }

  if(isDayjs(dateTime)) {
    return dateTime.format(natoDateTime);
  }
  return format(dateTime, natoDateTime);
}