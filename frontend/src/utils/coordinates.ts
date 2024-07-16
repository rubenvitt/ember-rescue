// MGRS (Military Grid Reference System) TypeScript Module

// Constants
const NUM_100K_SETS = 6;
const SET_ORIGIN_COLUMN_LETTERS = 'AJSAJS';
const SET_ORIGIN_ROW_LETTERS = 'AFAFAF';
const A = 65; // ASCII code for 'A'
const I = 73; // ASCII code for 'I'
const O = 79; // ASCII code for 'O'
const V = 86; // ASCII code for 'V'
const Z = 90; // ASCII code for 'Z'

const ECC_SQUARED = 0.00669438;
const SCALE_FACTOR = 0.9996;
const SEMI_MAJOR_AXIS = 6378137;
const EASTING_OFFSET = 500000;
const NORTHING_OFFSET = 10000000;

// Interfaces
interface LatLng {
  lat: number;
  lng: number;
}

interface UTMCoordinates {
  easting: number;
  northing: number;
  zoneNumber: number;
  zoneLetter: string;
}

interface BoundingBox {
  north: number;
  south: number;
  east: number;
  west: number;
}

// Main MGRS function
export function mgrs(input: LatLng | string, accuracy: number = 5): string | LatLng | BoundingBox | null {
  if (typeof input === 'string') {
    try {
      const utm = decode(input);
      const latLon = UTMtoLL(utm);
      if (accuracy === -1) {
        return getBoundingBox(utm);
      }
      return latLon;
    } catch {
      return null;
    }
  } else {
    if (input.lat < -80 || input.lat > 84) {
      return null;
    }
    try {
      const utm = LLtoUTM(input);
      return encode(utm, accuracy);
    } catch {
      return null;
    }
  }
}

export function formatMGRS(mgrsString: string | LatLng | BoundingBox): string {
  if (typeof mgrsString !== 'string') return '';

  // Remove all whitespace
  mgrsString = mgrsString.replace(/\s+/g, '');

  // Extract different parts of the MGRS string
  const zoneNumber = mgrsString.slice(0, 2);
  const zoneLetter = mgrsString.slice(2, 3);
  const gridSquare = mgrsString.slice(3, 5);
  const easting = mgrsString.slice(5, 10);
  const northing = mgrsString.slice(10, 15);

  // Format Easting and Northing with decimal points
  const formattedEasting = easting.slice(0, 5) + (easting.length > 5 ? ('.' + easting.slice(5)) : '');
  const formattedNorthing = northing.slice(0, 5) + (easting.length > 5 ? '.' + northing.slice(5) : '');

  // Assemble the formatted string
  return `${zoneNumber}${zoneLetter} ${gridSquare} ${formattedEasting} ${formattedNorthing}`;
}

// Helper functions
function getBoundingBox(utm: UTMCoordinates & { accuracy: number }): BoundingBox {
  const ll1 = UTMtoLL({ ...utm, easting: utm.easting - utm.accuracy / 2, northing: utm.northing - utm.accuracy / 2 });
  const ll2 = UTMtoLL({ ...utm, easting: utm.easting + utm.accuracy / 2, northing: utm.northing + utm.accuracy / 2 });
  return {
    north: Math.max(ll1.lat, ll2.lat),
    south: Math.min(ll1.lat, ll2.lat),
    east: Math.max(ll1.lng, ll2.lng),
    west: Math.min(ll1.lng, ll2.lng),
  };
}

function LLtoUTM(ll: LatLng): UTMCoordinates {
  const Lat = ll.lat;
  const Long = ll.lng;
  const a = SEMI_MAJOR_AXIS;
  const eccSquared = ECC_SQUARED;
  const k0 = SCALE_FACTOR;

  let LongOrigin: number;
  let ZoneNumber: number;
  const LatRad = degToRad(Lat);
  const LongRad = degToRad(Long);
  let LongOriginRad: number;

  ZoneNumber = Math.floor((Long + 180) / 6) + 1;

  // Make sure the longitude 180.00 is in Zone 60
  if (Long === 180) {
    ZoneNumber = 60;
  }

  // Special zone for Norway
  if (Lat >= 56.0 && Lat < 64.0 && Long >= 3.0 && Long < 12.0) {
    ZoneNumber = 32;
  }

  // Special zones for Svalbard
  if (Lat >= 72.0 && Lat < 84.0) {
    if (Long >= 0.0 && Long < 9.0) {
      ZoneNumber = 31;
    } else if (Long >= 9.0 && Long < 21.0) {
      ZoneNumber = 33;
    } else if (Long >= 21.0 && Long < 33.0) {
      ZoneNumber = 35;
    } else if (Long >= 33.0 && Long < 42.0) {
      ZoneNumber = 37;
    }
  }

  LongOrigin = (ZoneNumber - 1) * 6 - 180 + 3;  // +3 puts origin in middle of zone
  LongOriginRad = degToRad(LongOrigin);

  const eccPrimeSquared = (eccSquared) / (1 - eccSquared);

  const N = a / Math.sqrt(1 - eccSquared * Math.sin(LatRad) * Math.sin(LatRad));
  const T = Math.tan(LatRad) * Math.tan(LatRad);
  const C = eccPrimeSquared * Math.cos(LatRad) * Math.cos(LatRad);
  const A = Math.cos(LatRad) * (LongRad - LongOriginRad);

  const M = a * ((1 - eccSquared / 4 - 3 * eccSquared * eccSquared / 64 - 5 * eccSquared * eccSquared * eccSquared / 256) * LatRad
    - (3 * eccSquared / 8 + 3 * eccSquared * eccSquared / 32 + 45 * eccSquared * eccSquared * eccSquared / 1024) * Math.sin(2 * LatRad)
    + (15 * eccSquared * eccSquared / 256 + 45 * eccSquared * eccSquared * eccSquared / 1024) * Math.sin(4 * LatRad)
    - (35 * eccSquared * eccSquared * eccSquared / 3072) * Math.sin(6 * LatRad));

  const UTMEasting = (k0 * N * (A + (1 - T + C) * A * A * A / 6
      + (5 - 18 * T + T * T + 72 * C - 58 * eccPrimeSquared) * A * A * A * A * A / 120)
    + EASTING_OFFSET);

  let UTMNorthing = (k0 * (M + N * Math.tan(LatRad) * (A * A / 2 + (5 - T + 9 * C + 4 * C * C) * A * A * A * A / 24
    + (61 - 58 * T + T * T + 600 * C - 330 * eccPrimeSquared) * A * A * A * A * A * A / 720)));

  if (Lat < 0) {
    UTMNorthing += NORTHING_OFFSET; // 10000000 meter offset for southern hemisphere
  }

  return {
    northing: Math.round(UTMNorthing),
    easting: Math.round(UTMEasting),
    zoneNumber: ZoneNumber,
    zoneLetter: getLetterDesignator(Lat),
  };
}

function UTMtoLL(utm: UTMCoordinates): LatLng {
  const UTMNorthing = utm.northing;
  const UTMEasting = utm.easting;
  const zoneLetter = utm.zoneLetter;
  const zoneNumber = utm.zoneNumber;

  const k0 = SCALE_FACTOR;
  const a = SEMI_MAJOR_AXIS;
  const eccSquared = ECC_SQUARED;
  const e1 = (1 - Math.sqrt(1 - eccSquared)) / (1 + Math.sqrt(1 - eccSquared));

  // Remove 500,000 meter offset for longitude
  const x = UTMEasting - EASTING_OFFSET;
  let y = UTMNorthing;

  // If in southern hemisphere, adjust y accordingly
  if (zoneLetter < 'N') {
    y -= NORTHING_OFFSET;
  }

  // There are 60 zones with zone 1 being at West -180 to -174
  const LongOrigin = (zoneNumber - 1) * 6 - 180 + 3;  // +3 puts origin in middle of zone

  const eccPrimeSquared = (eccSquared) / (1 - eccSquared);

  const M = y / k0;
  const mu = M / (a * (1 - eccSquared / 4 - 3 * eccSquared * eccSquared / 64 - 5 * eccSquared * eccSquared * eccSquared / 256));

  const phi1Rad = mu + (3 * e1 / 2 - 27 * e1 * e1 * e1 / 32) * Math.sin(2 * mu)
    + (21 * e1 * e1 / 16 - 55 * e1 * e1 * e1 * e1 / 32) * Math.sin(4 * mu)
    + (151 * e1 * e1 * e1 / 96) * Math.sin(6 * mu);

  const N1 = a / Math.sqrt(1 - eccSquared * Math.sin(phi1Rad) * Math.sin(phi1Rad));
  const T1 = Math.tan(phi1Rad) * Math.tan(phi1Rad);
  const C1 = eccPrimeSquared * Math.cos(phi1Rad) * Math.cos(phi1Rad);
  const R1 = a * (1 - eccSquared) / Math.pow(1 - eccSquared * Math.sin(phi1Rad) * Math.sin(phi1Rad), 1.5);
  const D = x / (N1 * k0);

  let lat = phi1Rad - (N1 * Math.tan(phi1Rad) / R1) * (D * D / 2 - (5 + 3 * T1 + 10 * C1 - 4 * C1 * C1 - 9 * eccPrimeSquared) * D * D * D * D / 24
    + (61 + 90 * T1 + 298 * C1 + 45 * T1 * T1 - 252 * eccPrimeSquared - 3 * C1 * C1) * D * D * D * D * D * D / 720);
  lat = radToDeg(lat);

  let lon = (D - (1 + 2 * T1 + C1) * D * D * D / 6 + (5 - 2 * C1 + 28 * T1 - 3 * C1 * C1 + 8 * eccPrimeSquared + 24 * T1 * T1)
    * D * D * D * D * D / 120) / Math.cos(phi1Rad);
  lon = LongOrigin + radToDeg(lon);

  return {
    lat: lat,
    lng: lon,
  };
}

function encode(utm: UTMCoordinates, accuracy: number): string {
  // Prepend with leading zeroes
  const seasting = '00000' + utm.easting.toFixed(0);
  const snorthing = '00000' + utm.northing.toFixed(0);

  return utm.zoneNumber + utm.zoneLetter + get100kID(utm.easting, utm.northing, utm.zoneNumber) +
    seasting.substr(seasting.length - 5, accuracy) +
    snorthing.substr(snorthing.length - 5, accuracy);
}

function decode(mgrsString: string): UTMCoordinates & { accuracy: number } {
  // Remove all whitespace
  mgrsString = mgrsString.replace(/\s+/g, '');

  if (mgrsString.length === 0) {
    return {
      easting: 0,
      northing: 0,
      zoneLetter: '',
      zoneNumber: 0,
      accuracy: 0,
    };
  }

  const strLength = mgrsString.length;

  let hunK = null;
  let sb = '';
  let testChar;
  let i = 0;

  // Get Zone number
  while (!/[A-Z]/.test(testChar = mgrsString.charAt(i))) {
    if (i >= 2) {
      return {
        easting: 0,
        northing: 0,
        zoneLetter: '',
        zoneNumber: 0,
        accuracy: 0,
      };
    }
    sb += testChar;
    i++;
  }

  const zoneNumber = parseInt(sb, 10);

  if (i === 0 || i + 3 > strLength) {
    return {
      easting: 0,
      northing: 0,
      zoneLetter: '',
      zoneNumber: 0,
      accuracy: 0,
    };
  }

  const zoneLetter = mgrsString.charAt(i++);

  // Should we check the zone letter here? Why not.
  if (zoneLetter <= 'A' || zoneLetter === 'B' || zoneLetter === 'Y' || zoneLetter >= 'Z' || zoneLetter === 'I' || zoneLetter === 'O') {
    return {
      easting: 0,
      northing: 0,
      zoneLetter: '',
      zoneNumber: 0,
      accuracy: 0,
    };
  }

  hunK = mgrsString.substring(i, i += 2);

  const set = get100kSetForZone(zoneNumber);

  const east100k = getEastingFromChar(hunK.charAt(0), set);
  let north100k = getNorthingFromChar(hunK.charAt(
    1), set);

  // We have a bug where the northing may be 2000000 too low.
  // How do we know when to roll over?

  while (north100k < getMinNorthing(zoneLetter)) {
    north100k += 2000000;
  }

  // Calculate the char index for easting/northing separator
  const remainder = strLength - i;

  if (remainder % 2 !== 0) {
    return {
      easting: 0,
      northing: 0,
      zoneLetter: '',
      zoneNumber: 0,
      accuracy: 0,
    };
  }

  const sep = remainder / 2;

  const sepEasting = parseFloat(mgrsString.substring(i, i + sep));
  const sepNorthing = parseFloat(mgrsString.substring(i + sep));

  return {
    easting: sepEasting + east100k,
    northing: sepNorthing + north100k,
    zoneLetter: zoneLetter,
    zoneNumber: zoneNumber,
    accuracy: (sep > 0) ? Math.pow(10, 5 - sep) : 0,
  };
}

function getLetterDesignator(latitude: number): string {
  if (latitude <= 84 && latitude >= 72) return 'X';
  if (latitude < 72 && latitude >= -80) {
    const latBands = 'CDEFGHJKLMNPQRSTUVWX';
    const bandIdx = Math.floor((latitude + 80) / 8);
    return latBands.charAt(bandIdx);
  }
  if (latitude > 84 || latitude < -80) return 'Z';
  return '';
}

function get100kSetForZone(zoneNumber: number): number {
  let setParm = zoneNumber % NUM_100K_SETS;
  if (setParm === 0) setParm = NUM_100K_SETS;
  return setParm;
}

function get100kID(easting: number, northing: number, zoneNumber: number): string {
  const setParm = get100kSetForZone(zoneNumber);
  const setColumn = Math.floor(easting / 100000);
  const setRow = Math.floor(northing / 100000) % 20;
  return getLetter100kID(setColumn, setRow, setParm);
}

function getLetter100kID(column: number, row: number, parm: number): string {
  // colOrigin and rowOrigin are the letters at the origin of the set
  const index = parm - 1;
  const colOrigin = SET_ORIGIN_COLUMN_LETTERS.charCodeAt(index);
  const rowOrigin = SET_ORIGIN_ROW_LETTERS.charCodeAt(index);

  // colInt and rowInt are the letters to build to return
  let colInt = colOrigin + column - 1;
  let rowInt = rowOrigin + row;
  let rollover = false;

  if (colInt > Z) {
    colInt = colInt - Z + A - 1;
    rollover = true;
  }

  if (colInt === I || (colOrigin < I && colInt > I) || ((colInt > I || colOrigin < I) && rollover)) {
    colInt++;
  }

  if (colInt === O || (colOrigin < O && colInt > O) || ((colInt > O || colOrigin < O) && rollover)) {
    colInt++;
    if (colInt === I) colInt++;
  }

  if (colInt > Z) {
    colInt = colInt - Z + A - 1;
  }

  if (rowInt > V) {
    rowInt = rowInt - V + A - 1;
    rollover = true;
  } else {
    rollover = false;
  }

  if (((rowInt === I) || ((rowOrigin < I) && (rowInt > I))) || (((rowInt > I) || (rowOrigin < I)) && rollover)) {
    rowInt++;
  }

  if (((rowInt === O) || ((rowOrigin < O) && (rowInt > O))) || (((rowInt > O) || (rowOrigin < O)) && rollover)) {
    rowInt++;
    if (rowInt === I) rowInt++;
  }

  if (rowInt > V) {
    rowInt = rowInt - V + A - 1;
  }

  const twoLetter = String.fromCharCode(colInt) + String.fromCharCode(rowInt);
  return twoLetter;
}

function getEastingFromChar(e: string, set: number): number {
  let curCol = SET_ORIGIN_COLUMN_LETTERS.charCodeAt(set - 1);
  let eastingValue = 100000.0;
  let rewindMarker = false;

  while (curCol !== e.charCodeAt(0)) {
    curCol++;
    if (curCol === I) curCol++;
    if (curCol === O) curCol++;
    if (curCol > Z) {
      if (rewindMarker) return 0;
      curCol = A;
      rewindMarker = true;
    }
    eastingValue += 100000.0;
  }

  return eastingValue;
}

function getNorthingFromChar(n: string, set: number): number {
  if (n > 'V') return 0;

  let curRow = SET_ORIGIN_ROW_LETTERS.charCodeAt(set - 1);
  let northingValue = 0.0;
  let rewindMarker = false;

  while (curRow !== n.charCodeAt(0)) {
    curRow++;
    if (curRow === I) curRow++;
    if (curRow === O) curRow++;
    if (curRow > V) {
      if (rewindMarker) return 0;
      curRow = A;
      rewindMarker = true;
    }
    northingValue += 100000.0;
  }

  return northingValue;
}

function getMinNorthing(zoneLetter: string): number {
  let northing: number;
  switch (zoneLetter) {
    case 'C':
      northing = 1100000.0;
      break;
    case 'D':
      northing = 2000000.0;
      break;
    case 'E':
      northing = 2800000.0;
      break;
    case 'F':
      northing = 3700000.0;
      break;
    case 'G':
      northing = 4600000.0;
      break;
    case 'H':
      northing = 5500000.0;
      break;
    case 'J':
      northing = 6400000.0;
      break;
    case 'K':
      northing = 7300000.0;
      break;
    case 'L':
      northing = 8200000.0;
      break;
    case 'M':
      northing = 9100000.0;
      break;
    case 'N':
      northing = 0.0;
      break;
    case 'P':
      northing = 800000.0;
      break;
    case 'Q':
      northing = 1700000.0;
      break;
    case 'R':
      northing = 2600000.0;
      break;
    case 'S':
      northing = 3500000.0;
      break;
    case 'T':
      northing = 4400000.0;
      break;
    case 'U':
      northing = 5300000.0;
      break;
    case 'V':
      northing = 6200000.0;
      break;
    case 'W':
      northing = 7000000.0;
      break;
    case 'X':
      northing = 7900000.0;
      break;
    default:
      northing = 0.0;
      break;
  }
  return northing;
}

function degToRad(deg: number): number {
  return (deg * (Math.PI / 180.0));
}

function radToDeg(rad: number): number {
  return (rad / (Math.PI / 180.0));
}