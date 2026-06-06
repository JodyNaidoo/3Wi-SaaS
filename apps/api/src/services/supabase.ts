import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL ?? '',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  { auth: { persistSession: false } },
);

export async function uploadPhoto(opts: { tenantId: string; projectId: string; userId: string; buffer: Buffer; mime: string }) {
  const bucket = process.env.SUPABASE_BUCKET ?? 'photos';
  const ext = opts.mime.split('/')[1] ?? 'jpg';
  const path = `${opts.tenantId}/${opts.projectId}/${opts.userId}/${Date.now()}.${ext}`;
  const { error } = await supabaseAdmin.storage.from(bucket).upload(path, opts.buffer, {
    contentType: opts.mime,
    upsert: false,
  });
  if (error) throw error;
  return path;
}

export async function presignedPhotoUrl(path: string, expiresInSec = 3600) {
  const bucket = process.env.SUPABASE_BUCKET ?? 'photos';
  const { data, error } = await supabaseAdmin.storage.from(bucket).createSignedUrl(path, expiresInSec);
  if (error) throw error;
  return data.signedUrl;
}

// =====================================================================
// Offtaker Annexure A attachments (separate bucket)
// =====================================================================
const OFFTAKER_BUCKET = process.env.SUPABASE_OFFTAKER_BUCKET ?? 'offtaker-attachments';

export async function uploadOfftakerAttachment(opts: {
  tenantId: string;
  submissionId: string;
  filename: string;
  buffer: Buffer;
  mime: string;
}): Promise<string> {
  // Sanitise filename for storage (keep extension)
  const safeName = opts.filename.replace(/[^a-zA-Z0-9.\-_]+/g, '_').slice(0, 100);
  const path = `${opts.tenantId}/${opts.submissionId}/${Date.now()}_${safeName}`;
  const { error } = await supabaseAdmin.storage.from(OFFTAKER_BUCKET).upload(path, opts.buffer, {
    contentType: opts.mime,
    upsert: false,
  });
  if (error) throw error;
  return path;
}

export async function offtakerAttachmentSignedUrl(path: string, expiresInSec = 600): Promise<string> {
  const { data, error } = await supabaseAdmin.storage.from(OFFTAKER_BUCKET).createSignedUrl(path, expiresInSec);
  if (error) throw error;
  return data.signedUrl;
}

export async function deleteOfftakerAttachment(path: string): Promise<void> {
  const { error } = await supabaseAdmin.storage.from(OFFTAKER_BUCKET).remove([path]);
  if (error) throw error;
}
