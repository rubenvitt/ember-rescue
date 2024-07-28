import { ensureSlashBetween } from './http.utils';

describe('ensureSlashBetween', () => {
  it('should correctly concatenate two parts with a single slash', () => {
    expect(ensureSlashBetween('http://example.com', 'path/to/resource')).toBe(
      'http://example.com/path/to/resource',
    );
  });

  it('should not add an extra slash if one already exists', () => {
    expect(ensureSlashBetween('http://example.com/', 'path/to/resource')).toBe(
      'http://example.com/path/to/resource',
    );
  });

  it('should handle cases where neither part has a trailing or leading slash', () => {
    expect(ensureSlashBetween('example', 'path')).toBe('example/path');
  });

  it('should handle cases where both parts have a trailing and leading slash respectively', () => {
    expect(ensureSlashBetween('example/', '/path')).toBe('example/path');
  });

  it('should preserve protocol slashes', () => {
    expect(ensureSlashBetween('http://example', 'path')).toBe(
      'http://example/path',
    );
    expect(ensureSlashBetween('https://example', 'path')).toBe(
      'https://example/path',
    );
  });
});
