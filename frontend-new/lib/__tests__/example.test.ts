import { describe, it, expect } from 'vitest';

// Example utility function to test
function formatPrice(amount: number, currency: string = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
  }).format(amount);
}

describe('formatPrice utility', () => {
  it('should format INR currency correctly', () => {
    const result = formatPrice(1000);
    expect(result).toContain('1,000');
    expect(result).toContain('₹');
  });

  it('should format USD currency correctly', () => {
    const result = formatPrice(1000, 'USD');
    expect(result).toContain('1,000');
    expect(result).toContain('$');
  });

  it('should handle zero amount', () => {
    const result = formatPrice(0);
    expect(result).toContain('0');
  });

  it('should handle decimal amounts', () => {
    const result = formatPrice(1234.56);
    expect(result).toContain('1,234');
  });
});

// Example: Testing a simple validation function
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

describe('isValidEmail utility', () => {
  it('should validate correct email addresses', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('test.user@domain.co.in')).toBe(true);
  });

  it('should reject invalid email addresses', () => {
    expect(isValidEmail('invalid')).toBe(false);
    expect(isValidEmail('user@')).toBe(false);
    expect(isValidEmail('@domain.com')).toBe(false);
    expect(isValidEmail('user @domain.com')).toBe(false);
  });

  it('should reject empty string', () => {
    expect(isValidEmail('')).toBe(false);
  });
});
