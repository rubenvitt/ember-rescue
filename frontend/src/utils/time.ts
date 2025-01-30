import { format } from 'date-fns';
import dayjs, { Dayjs, isDayjs } from 'dayjs';

export const natoDateTime = 'ddHHmmLLLyy';
export const natoDateTimeAnt = 'DDHHmmMMMYY';

export function formatNatoDateTime<DateType extends Date>(dateTime: DateType | Dayjs | number | string | undefined): string | undefined {
  if (!dateTime) {
    return undefined;
  }

  if (isDayjs(dateTime)) {
    return dateTime.format(natoDateTime);
  }
  return format(dateTime, natoDateTime);
}

/**
 * Parst ein Datum im NATO-Format oder Standard-Format in ein Dayjs-Objekt
 *
 * @param input - Das zu parsende Datum als String
 * @returns Dayjs Objekt wenn das Parsing erfolgreich war
 * @throws Error wenn das Datum nicht geparst werden konnte
 */
export function parseNatoDateTime(input: string | undefined): Dayjs {
  if (!input) {
    throw new Error('Kein Datum übergeben');
  }

  try {
    // Versuche zuerst, das Datum direkt im NATO-Format zu parsen
    const dateTime = dayjs(input, natoDateTime, true);
    if (dateTime.isValid()) {
      return dateTime;
    }

    // Wenn das nicht klappt, versuche es als normales Datum zu parsen
    const fallbackDate = dayjs(input);
    if (fallbackDate.isValid()) {
      return fallbackDate;
    }

    // Wenn beide Versuche fehlschlagen, wirf einen Fehler
    throw new Error('Datum konnte nicht geparst werden');
  } catch (error) {
    console.error('Fehler beim Parsen des Datums:', error);
    throw new Error(`Ungültiges Datumsformat: ${input}`);
  }
}
