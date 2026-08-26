import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import cloudinary from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  const allowedFolders = new Set(['pimuk-art/projects', 'pimuk-art/receipts', 'pimuk-art/it-assets']);
  const requestedFolder = formData.get('folder') as string | null;
  const folder = requestedFolder && allowedFolders.has(requestedFolder) ? requestedFolder : 'pimuk-art/projects';

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (err, result) => {
        if (err || !result) return reject(err);
        resolve(result as { secure_url: string });
      }
    ).end(buffer);
  });

  return NextResponse.json({ url: result.secure_url });
}
