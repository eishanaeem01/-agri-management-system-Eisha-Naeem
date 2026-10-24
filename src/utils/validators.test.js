import { describe, it, expect } from 'vitest';
import { validateName, validateCnic, validateImage, validateQuantity, validateLogin } from './validators';
import { formatCnic, statusFromScore, humidityStatus } from './formatters';

describe('validators', () => {
  it('validates names', () => {
    expect(validateName('')).toMatch(/required/);
    expect(validateName('Al')).toMatch(/3 characters/);
    expect(validateName('Ali123')).toMatch(/letters and spaces/);
    expect(validateName('Ali Raza')).toBe('');
  });
  it('validates CNIC format and duplicates', () => {
    expect(validateCnic('12345')).toMatch(/13 digits/);
    expect(validateCnic('12345-1234567-1')).toBe('');
    expect(validateCnic('12345-1234567-1', [{ id: 'a', cnic: '12345-1234567-1' }])).toMatch(/already/);
    expect(validateCnic('12345-1234567-1', [{ id: 'a', cnic: '12345-1234567-1' }], 'a')).toBe('');
  });
  it('validates images (type and 1 MB limit)', () => {
    expect(validateImage(null)).toMatch(/required/);
    expect(validateImage({ type: 'image/gif', size: 100 })).toMatch(/JPG or PNG/);
    expect(validateImage({ type: 'image/png', size: 2 * 1024 * 1024 })).toMatch(/1 MB/);
    expect(validateImage({ type: 'image/jpeg', size: 500 })).toBe('');
  });
  it('validates quantity against stock', () => {
    expect(validateQuantity('', 10)).toMatch(/required/);
    expect(validateQuantity(0, 10)).toMatch(/greater than 0/);
    expect(validateQuantity(11, 10)).toMatch(/Only 10/);
    expect(validateQuantity(10, 10)).toBe('');
  });
  it('validates login', () => {
    expect(Object.keys(validateLogin({ username: '', password: '' }))).toHaveLength(2);
    expect(validateLogin({ username: 'admin', password: 'admin123' })).toEqual({});
  });
});

describe('formatters', () => {
  it('auto-formats CNIC with dashes', () => {
    expect(formatCnic('1234512345671')).toBe('12345-1234567-1');
    expect(formatCnic('123456')).toBe('12345-6');
    expect(formatCnic('abc')).toBe('');
  });
  it('maps score and humidity to labels', () => {
    expect(statusFromScore(90)).toBe('Healthy');
    expect(statusFromScore(50)).toBe('Needs Attention');
    expect(statusFromScore(10)).toBe('Critical');
    expect(humidityStatus(20)).toBe('Low');
    expect(humidityStatus(55)).toBe('Optimal');
    expect(humidityStatus(85)).toBe('High');
  });
});
