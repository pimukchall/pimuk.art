const VALID_TYPES = ['LAPTOP', 'DESKTOP', 'MONITOR', 'PERIPHERAL', 'NETWORK_EQUIPMENT', 'SOFTWARE_LICENSE', 'OTHER'];
const VALID_STATUSES = ['IN_USE', 'IN_STORAGE', 'REPAIR', 'RETIRED', 'LOST'];

export function validateITAssetPayload(body: Record<string, unknown>): string | null {
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  if (!name) return 'ต้องระบุชื่ออุปกรณ์';
  if (!VALID_TYPES.includes(body.type as string)) return 'ประเภทอุปกรณ์ไม่ถูกต้อง';
  if (body.status != null && !VALID_STATUSES.includes(body.status as string)) return 'สถานะไม่ถูกต้อง';
  if (body.purchasePrice != null && body.purchasePrice !== '' && Number(body.purchasePrice) < 0) return 'ราคาซื้อต้องไม่ติดลบ';
  if (body.purchaseDate && body.warrantyExpiry) {
    if (new Date(body.warrantyExpiry as string) < new Date(body.purchaseDate as string)) {
      return 'วันหมดประกันต้องไม่ก่อนวันที่ซื้อ';
    }
  }
  return null;
}
