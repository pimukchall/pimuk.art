import { describe, it, expect } from 'vitest';
import { validateLicensePayload } from './license';

describe('validateLicensePayload', () => {
  it('rejects empty name', () => {
    expect(validateLicensePayload({ name: '  ', seatsTotal: 1 })).toBe('ต้องระบุชื่อ license');
  });

  it('rejects seatsTotal < 1', () => {
    expect(validateLicensePayload({ name: 'x', seatsTotal: 0 })).toBe('จำนวน seat ต้องเป็นจำนวนเต็มอย่างน้อย 1');
  });

  it('rejects non-integer seatsTotal', () => {
    expect(validateLicensePayload({ name: 'x', seatsTotal: 1.5 })).toBe('จำนวน seat ต้องเป็นจำนวนเต็มอย่างน้อย 1');
  });

  it('rejects invalid billingCycle', () => {
    expect(validateLicensePayload({ name: 'x', seatsTotal: 1, billingCycle: 'BOGUS' })).toBe('รอบการเรียกเก็บเงินไม่ถูกต้อง');
  });

  it('rejects negative cost', () => {
    expect(validateLicensePayload({ name: 'x', seatsTotal: 1, cost: -5 })).toBe('ค่าใช้จ่ายต้องไม่ติดลบ');
  });

  it('rejects renewalDate before purchaseDate', () => {
    expect(
      validateLicensePayload({ name: 'x', seatsTotal: 1, purchaseDate: '2026-06-01', renewalDate: '2026-01-01' })
    ).toBe('วันต่ออายุต้องไม่ก่อนวันที่ซื้อ');
  });

  it('returns null for a valid payload', () => {
    expect(
      validateLicensePayload({
        name: 'Adobe CC',
        seatsTotal: 5,
        billingCycle: 'YEARLY',
        cost: 1200,
        purchaseDate: '2026-01-01',
        renewalDate: '2027-01-01',
      })
    ).toBeNull();
  });
});
