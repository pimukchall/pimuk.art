const VALID_BILLING = ['ONE_TIME', 'MONTHLY', 'YEARLY'];

export function validateLicensePayload(body: Record<string, unknown>): string | null {
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  if (!name) return 'ต้องระบุชื่อ license';
  const seatsTotal = Number(body.seatsTotal);
  if (!Number.isInteger(seatsTotal) || seatsTotal < 1) return 'จำนวน seat ต้องเป็นจำนวนเต็มอย่างน้อย 1';
  if (body.billingCycle != null && !VALID_BILLING.includes(body.billingCycle as string)) return 'รอบการเรียกเก็บเงินไม่ถูกต้อง';
  if (body.cost != null && body.cost !== '' && Number(body.cost) < 0) return 'ค่าใช้จ่ายต้องไม่ติดลบ';
  if (body.purchaseDate && body.renewalDate) {
    if (new Date(body.renewalDate as string) < new Date(body.purchaseDate as string)) {
      return 'วันต่ออายุต้องไม่ก่อนวันที่ซื้อ';
    }
  }
  return null;
}
