import { Fahrzeug, OptaFunktion } from '@prisma/client';

export function formatFunkrufnameMitTyp(
  fahrzeug: Fahrzeug & { optaFunktion: OptaFunktion | null },
) {
  if (fahrzeug.optaFunktion) {
    return fahrzeug.funkrufname + ` (${fahrzeug.optaFunktion.label})`;
  } else return fahrzeug.funkrufname;
}
