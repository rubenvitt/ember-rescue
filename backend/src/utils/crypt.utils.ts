import * as crypto from 'crypto';
import mongoose from 'mongoose';

const algorithm = 'aes-256-ctr';
const saltLength = 16;

interface PreHookDocument extends mongoose.Document {
  isModified(path: string): boolean;

  [key: string]: unknown;
}

function generateKey(secret: string, salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(secret, salt, 100000, 32, 'sha256');
}

export function encrypt(value: string, secret: string): string {
  const salt = crypto.randomBytes(saltLength);
  const iv = crypto.randomBytes(16);
  const key = generateKey(secret, salt);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(value), cipher.final()]);
  return Buffer.concat([salt, iv, encrypted]).toString('hex');
}

export function decrypt(hash: string, secret: string): string {
  const buffer = Buffer.from(hash, 'hex');
  const salt = buffer.slice(0, saltLength);
  const iv = buffer.slice(saltLength, saltLength + 16);
  const content = buffer.slice(saltLength + 16);
  const key = generateKey(secret, salt);
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  const decrypted = Buffer.concat([decipher.update(content), decipher.final()]);
  return decrypted.toString();
}

function createEncryptionHook<TClass extends PreHookDocument>(
  fields: (keyof TClass)[],
  secret: string,
) {
  return function (
    this: mongoose.Query<any, TClass> | TClass,
    next: mongoose.CallbackWithoutResultAndOptionalError,
  ) {
    if (this instanceof mongoose.Query) {
      const update = this.getUpdate() as any;
      if (!update) return next();

      const updateObj = update.$set || update;

      fields.forEach((field) => {
        if (field in updateObj) {
          updateObj[field] = encrypt(updateObj[field], secret);
        }
      });
    } else {
      fields.forEach((field) => {
        const value = this.get(field as string);
        if (this.isModified(field as string) && typeof value === 'string') {
          this.set(field as string, encrypt(value, secret));
        }
      });
    }

    next();
  };
}

function createDecryptionHook<TClass extends PreHookDocument>(
  fields: (keyof TClass)[],
  secret: string,
) {
  return function (this: TClass) {
    fields.forEach((field) => {
      const value = this.get(field as string);
      if (value && typeof value === 'string') {
        this.set(field as string, decrypt(value, secret));
      }
    });
  };
}

export function createEncryptedSchema<TClass extends PreHookDocument>(
  schema: mongoose.Schema<TClass>,
  fields: (keyof TClass)[],
  secret: string,
) {
  schema.pre(
    ['save', 'updateOne', 'findOneAndUpdate'],
    createEncryptionHook<TClass>(fields, secret),
  );

  schema.post('init', createDecryptionHook<TClass>(fields, secret));
}

// TODO[ember-rescue-68](rubeen, 30.12.24): was ist hiermit?
export type EncryptedDocument<T> = T & PreHookDocument;
