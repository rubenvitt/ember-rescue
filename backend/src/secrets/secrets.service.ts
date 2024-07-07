import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class SecretsService {
  private readonly logger = new Logger(SecretsService.name);
  private readonly encryptionKey: Buffer;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {
    const key = this.configService.get<string>('ENCRYPTION_KEY');
    if (!key) {
      throw new Error('ENCRYPTION_KEY must be set in the environment');
    }
    this.encryptionKey = Buffer.from(key, 'utf8');
  }

  async save(key: string, value: string): Promise<void> {
    const encryptedValue = this.encrypt(value);
    await this.prismaService.secret.upsert({
      where: { key },
      update: { value: encryptedValue },
      create: { key, value: encryptedValue },
    });
  }

  async read(key: string): Promise<string | null> {
    const secret = await this.prismaService.secret.findUnique({
      where: { key },
    });

    if (!secret) return null;
    return this.decrypt(secret.value);
  }

  private encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', this.encryptionKey, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  private decrypt(text: string): string {
    const [ivHex, encryptedHex] = text.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      this.encryptionKey,
      iv,
    );
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
