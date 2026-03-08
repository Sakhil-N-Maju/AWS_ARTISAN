/**
 * Encryption Service
 *
 * Data encryption and key management
 */

export interface EncryptionKey {
  id: string;
  algorithm: 'AES-256' | 'RSA-2048' | 'RSA-4096';
  purpose: 'data' | 'communication' | 'storage';
  createdAt: Date;
  expiresAt?: Date;
  rotated: boolean;
  rotatedAt?: Date;
}

export interface EncryptedData {
  id: string;
  dataType: string;
  encrypted: boolean;
  algorithm: string;
  keyId: string;
  encryptedAt: Date;
}

export class EncryptionService {
  private keys: Map<string, EncryptionKey> = new Map();
  private encryptedData: Map<string, EncryptedData> = new Map();

  constructor() {
    this.initializeDefaultKeys();
  }

  async createKey(data: {
    algorithm: EncryptionKey['algorithm'];
    purpose: EncryptionKey['purpose'];
    expiresAt?: Date;
  }): Promise<EncryptionKey> {
    const key: EncryptionKey = {
      id: `key-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      algorithm: data.algorithm,
      purpose: data.purpose,
      createdAt: new Date(),
      expiresAt: data.expiresAt,
      rotated: false,
    };
    this.keys.set(key.id, key);
    return key;
  }

  async encryptData(dataId: string, dataType: string, keyId: string): Promise<EncryptedData> {
    const key = this.keys.get(keyId);
    if (!key) throw new Error('Encryption key not found');

    const encrypted: EncryptedData = {
      id: dataId,
      dataType,
      encrypted: true,
      algorithm: key.algorithm,
      keyId,
      encryptedAt: new Date(),
    };

    this.encryptedData.set(dataId, encrypted);
    return encrypted;
  }

  async rotateKey(keyId: string): Promise<EncryptionKey> {
    const oldKey = this.keys.get(keyId);
    if (!oldKey) throw new Error('Key not found');

    oldKey.rotated = true;
    oldKey.rotatedAt = new Date();
    this.keys.set(keyId, oldKey);

    const newKey = await this.createKey({
      algorithm: oldKey.algorithm,
      purpose: oldKey.purpose,
    });

    return newKey;
  }

  async getEncryptionStats(): Promise<{
    totalKeys: number;
    activeKeys: number;
    rotatedKeys: number;
    encryptedData: number;
  }> {
    const keys = Array.from(this.keys.values());
    return {
      totalKeys: keys.length,
      activeKeys: keys.filter((k) => !k.rotated).length,
      rotatedKeys: keys.filter((k) => k.rotated).length,
      encryptedData: this.encryptedData.size,
    };
  }

  private initializeDefaultKeys(): void {
    this.createKey({
      algorithm: 'AES-256',
      purpose: 'data',
    });

    this.createKey({
      algorithm: 'RSA-2048',
      purpose: 'communication',
    });
  }
}

export const encryptionService = new EncryptionService();
