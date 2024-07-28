import {
  extractBearbeiterId,
  extractEinsatzId,
  extractId,
} from './header.utils';

describe('extractId', () => {
  it('should return null if headerValue is null or does not start with prefix', () => {
    expect(extractId('', 'Prefix:')).toBeNull();
    expect(extractId('Some-Value', 'Prefix:')).toBeNull();
  });

  it('should extract ID correctly if headerValue starts with prefix', () => {
    expect(extractId('Prefix: 12345', 'Prefix:')).toBe('12345');
    expect(extractId('Prefix: abcde', 'Prefix:')).toBe('abcde');
  });

  it('should return null if headerValue starts with prefix but has no ID', () => {
    expect(extractId('Prefix: ', 'Prefix:')).toBeNull();
  });
});

describe('extractEinsatzId', () => {
  it('should extract Einsatz ID correctly when headerValue has correct prefix', () => {
    expect(extractEinsatzId('Einsatz-ID: 67890')).toBe('67890');
  });

  it('should return null when headerValue does not have the correct prefix', () => {
    expect(extractEinsatzId('Another-Prefix: 67890')).toBeNull();
    expect(extractEinsatzId('')).toBeNull();
  });
});

describe('extractBearbeiterId', () => {
  it('should extract Bearbeiter ID correctly when headerValue has correct prefix', () => {
    expect(extractBearbeiterId('Bearbeiter-ID: 54321')).toBe('54321');
  });

  it('should return null when headerValue does not have the correct prefix', () => {
    expect(extractBearbeiterId('Another-Prefix: 54321')).toBeNull();
    expect(extractBearbeiterId('')).toBeNull();
  });
});
