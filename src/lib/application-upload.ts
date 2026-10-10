import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';

export const MAX_CV_SIZE = 10 * 1024 * 1024;
export const APPLICATION_TOKEN_TTL_MS = 30 * 60 * 1000;

export const acceptedTypes = new Map([
  ['application/pdf', '.pdf'],
  ['application/msword', '.doc'],
  ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', '.docx'],
]);

export type ApplicationUploadClaims = {
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  qualification: string;
  coverNote: string;
  vacancyId: string;
  vacancyTitle: string;
  filePath: string;
  fileName: string;
  contentType: string;
  fileSize: number;
  expiresAt: number;
};

const secret = () => process.env.SUPABASE_SERVICE_ROLE_KEY;

export function createApplicationUploadToken(claims: ApplicationUploadClaims) {
  const key = secret();
  if (!key) throw new Error('Application signing is not configured.');
  const payload = Buffer.from(JSON.stringify(claims)).toString('base64url');
  const signature = createHmac('sha256', key).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

export function readApplicationUploadToken(token: unknown): ApplicationUploadClaims | null {
  if (typeof token !== 'string' || token.length > 8_000) return null;
  const [payload, signature, extra] = token.split('.');
  const key = secret();
  if (!key || !payload || !signature || extra) return null;
  const expected = createHmac('sha256', key).update(payload).digest();
  let supplied: Buffer;
  try { supplied = Buffer.from(signature, 'base64url'); } catch { return null; }
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null;
  try {
    const claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as ApplicationUploadClaims;
    if (!claims || typeof claims !== 'object' || claims.expiresAt <= Date.now()) return null;
    if (!/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}\.(pdf|doc|docx)$/i.test(claims.filePath)) return null;
    if (typeof claims.applicantName !== 'string' || typeof claims.applicantEmail !== 'string'
      || typeof claims.applicantPhone !== 'string' || typeof claims.vacancyId !== 'string'
      || typeof claims.vacancyTitle !== 'string' || typeof claims.fileName !== 'string'
      || typeof claims.contentType !== 'string' || typeof claims.fileSize !== 'number'
      || !acceptedTypes.has(claims.contentType) || claims.fileSize <= 0 || claims.fileSize > MAX_CV_SIZE) return null;
    return claims;
  } catch { return null; }
}

export function hasValidDocumentSignature(contentType: string, bytes: Uint8Array) {
  const isPdf = contentType === 'application/pdf' && String.fromCharCode(...bytes.slice(0, 4)) === '%PDF';
  const isDocx = contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    && bytes[0] === 0x50 && bytes[1] === 0x4b;
  const isDoc = contentType === 'application/msword' && bytes[0] === 0xd0 && bytes[1] === 0xcf;
  return isPdf || isDocx || isDoc;
}
