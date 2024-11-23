export function extractId(headerValue: string, prefix: string): string | null {
  if (!headerValue || !headerValue.startsWith(prefix)) {
    return null;
  }
  return headerValue.split(`${prefix} `)[1] || null;
}

export function extractEinsatzId(
  headerValue: string,
  required: boolean = false,
): string | null {
  return extractId(headerValue, 'Einsatz-ID:');
}

export function extractBearbeiterName(headerValue: string): string | null {
  return headerValue;
}
