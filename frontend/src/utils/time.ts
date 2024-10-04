import { format } from 'date-fns';
import dayjs, { Dayjs, isDayjs } from 'dayjs';

export const natoDateTime = 'ddHHmmLLLyy';
export const natoDateTimeAnt = 'DDHHmmMMMYY';

export function formatNatoDateTime<DateType extends Date>(
  dateTime: DateType | Dayjs | number | string | undefined,
): string | undefined {
  if (!dateTime) {
    return undefined;
  }

  if (isDayjs(dateTime)) {
    return dateTime.format(natoDateTime);
  }
  return format(dateTime, natoDateTime);
}

export function parseNatoDateTime(input: string | undefined): Dayjs {
  console.log('trying to parse', input, 'with format', natoDateTime, 'and', natoDateTimeAnt, 'and');
  if (!input) {
    throw new Error('Invalid input');
  }

  let dateTime = dayjs(input, natoDateTime, true);
  if (dateTime.isValid()) {
    return dateTime;
  }

  dateTime = dayjs(format(new Date(input), natoDateTime));
  if (dateTime.isValid()) {
    return dateTime;
  }

  throw new Error('Invalid input 1');
}
