import { describe, expect, it } from 'vitest';
import { validateName, validateCnic, validateImage, validateQuantity, isDuplicateCnic } from '../utils/validators';
import { formatCnic, healthStatus, humidityStatus } from '../utils/formatters';
import { toCsv } from '../utils/exportCsv';

describe('validateName', () => {
  it('requires a value', () => expect(validateName('')).toMatch(/required/i));
  it('rejects digits and symbols', () => expect(validateName('Ali 123')).toMatch(/letters/i));
  it('requires 3+ characters', () => expect(validateName('Al')).toMatch(/3 characters/));
  it('accepts valid names', () => expect(validateName('Ali Khan')).toBe(''));
});

describe('validateCnic', () => {
  const buyers = [{ id: '1', cnic: '34101-1234567-1' }];
  it('requires a value', () => expect(validateCnic('')).toMatch(/required/i));
  it('rejects wrong format', () => expect(validateCnic('3410112345671')).toMatch(/format/i));
  it('detects duplicates', () => expect(validateCnic('34101-1234567-1', buyers)).toMatch(/already exists/));
  it('ignores the record being edited', () => expect(validateCnic('34101-1234567-1', buyers, '1')).toBe(''));
  it('accepts a valid new CNIC', () => expect(validateCnic('34101-7654321-9', buyers)).toBe(''));
  it('isDuplicateCnic works', () => expect(isDuplicateCnic('34101-1234567-1', buyers)).toBe(true));
});

describe('validateImage', () => {
  it('requires a file', () => expect(validateImage(null)).toMatch(/required/i));
  it('rejects non JPG/PNG', () => expect(validateImage({ type: 'image/gif', size: 100 })).toMatch(/JPG or PNG/));
  it('rejects > 1 MB', () => expect(validateImage({ type: 'image/png', size: 1024 * 1024 + 1 })).toMatch(/1 MB/));
  it('accepts valid files', () => {
    expect(validateImage({ type: 'image/jpeg', size: 500000 })).toBe('');
    expect(validateImage({ type: 'image/png', size: 1024 * 1024 })).toBe('');
  });
});

describe('validateQuantity', () => {
  it('requires a value', () => expect(validateQuantity('', 100)).toMatch(/required/i));
  it('rejects zero / negative', () => expect(validateQuantity(0, 100)).toMatch(/greater than 0/));
  it('cannot exceed stock', () => expect(validateQuantity(101, 100)).toMatch(/100 kg/));
  it('flags out-of-stock', () => expect(validateQuantity(1, 0)).toMatch(/out of stock/));
  it('accepts valid', () => expect(validateQuantity(100, 100)).toBe(''));
});

describe('formatters', () => {
  it('formats CNIC with automatic dashes', () => {
    expect(formatCnic('3410112345671')).toBe('34101-1234567-1');
    expect(formatCnic('34101123')).toBe('34101-123');
    expect(formatCnic('34a101-12')).toBe('34101-12');
    expect(formatCnic('34101123456719999')).toBe('34101-1234567-1');
  });
  it('maps health score to status', () => {
    expect(healthStatus(90)).toBe('Healthy');
    expect(healthStatus(50)).toBe('Needs Attention');
    expect(healthStatus(10)).toBe('Critical');
  });
  it('maps humidity to status', () => {
    expect(humidityStatus(20).label).toBe('Low');
    expect(humidityStatus(55).label).toBe('Optimal');
    expect(humidityStatus(85).label).toBe('High');
  });
});

describe('toCsv', () => {
  it('escapes quotes and formula characters', () => {
    const csv = toCsv([{ a: 'He said "hi"', b: '=SUM(1)' }], [{ label: 'A', key: 'a' }, { label: 'B', key: 'b' }]);
    expect(csv).toContain('"He said ""hi"""');
    expect(csv).toContain(`"'=SUM(1)"`);
  });
});
