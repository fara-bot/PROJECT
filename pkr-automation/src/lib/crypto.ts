import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

// Ensure ENCRYPTION_KEY is set in your .env.local file
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;

if (!ENCRYPTION_KEY) {
  console.warn('Warning: ENCRYPTION_KEY is not set. Encryption/decryption will fail.');
}

export async function encrypt(text: string): Promise<string> {
  if (!ENCRYPTION_KEY) throw new Error('ENCRYPTION_KEY is not set in environment variables.');
  
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

export async function decrypt(text: string): Promise<string> {
  if (!ENCRYPTION_KEY) throw new Error('ENCRYPTION_KEY is not set in environment variables.');

  const textParts = text.split(':');
  const ivHex = textParts.shift();
  if (!ivHex) throw new Error('Invalid encrypted text format.');

  const iv = Buffer.from(ivHex, 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  
  return decrypted.toString();
}
