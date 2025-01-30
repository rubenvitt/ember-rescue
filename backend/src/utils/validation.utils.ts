import { BadRequestException } from "@nestjs/common";

const MAX_KEY_LENGTH = 100;

export function validateKey(key: string): string {
    if (!key || typeof key !== 'string') {
        throw new BadRequestException('Invalid key format');
    }
    if (key.length > MAX_KEY_LENGTH) {
        throw new BadRequestException(`Key length must not exceed ${MAX_KEY_LENGTH} characters`);
    }
    if (!/^[a-zA-Z0-9\-_]+$/.test(key)) {
        throw new BadRequestException('Key must only contain alphanumeric characters, hyphens and underscores');
    }
    return key.toString();
}