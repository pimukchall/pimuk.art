import { describe, it, expect } from 'vitest';
import { validateITAssetPayload } from './it-asset';

describe('validateITAssetPayload', () => {
  it('rejects empty name', () => {
    expect(validateITAssetPayload({ name: '  ', type: 'LAPTOP' })).toBe('ต้องระบุชื่ออุปกรณ์');
  });

  it('rejects invalid type', () => {
    expect(validateITAssetPayload({ name: 'x', type: 'BOGUS' })).toBe('ประเภทอุปกรณ์ไม่ถูกต้อง');
  });

  it('rejects invalid status', () => {
    expect(validateITAssetPayload({ name: 'x', type: 'LAPTOP', status: 'BOGUS' })).toBe('สถานะไม่ถูกต้อง');
  });

  it('rejects negative purchasePrice', () => {
    expect(validateITAssetPayload({ name: 'x', type: 'LAPTOP', purchasePrice: -1 })).toBe('ราคาซื้อต้องไม่ติดลบ');
  });

  it('rejects warrantyExpiry before purchaseDate', () => {
    expect(
      validateITAssetPayload({ name: 'x', type: 'LAPTOP', purchaseDate: '2026-06-01', warrantyExpiry: '2026-01-01' })
    ).toBe('วันหมดประกันต้องไม่ก่อนวันที่ซื้อ');
  });

  it('returns null for a valid payload', () => {
    expect(
      validateITAssetPayload({
        name: 'ThinkPad',
        type: 'LAPTOP',
        status: 'IN_USE',
        purchasePrice: 30000,
        purchaseDate: '2026-01-01',
        warrantyExpiry: '2027-01-01',
      })
    ).toBeNull();
  });
});
