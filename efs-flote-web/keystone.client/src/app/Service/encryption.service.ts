import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class EncryptionService {


  private readonly encoder = new TextEncoder();
  private readonly decoder = new TextDecoder();

  async encrypt(value: number, password: string): Promise<string> {
    
    if (!Number.isFinite(value)) {
      throw new Error('The value must be a limited number.');
    }
    if (!password) {
      throw new Error('Encryption key is missed.');
    }

    const plainText = String(value);

    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const key = await this.deriveKey(password, salt);

    const cipherBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      this.encoder.encode(plainText)
    );

    const saltB64 = this.toBase64(salt);
    const ivB64 = this.toBase64(iv);
    const cipherB64 = this.toBase64(new Uint8Array(cipherBuffer));

    return `${saltB64}.${ivB64}.${cipherB64}`;
  }

  async decrypt(payload: string, password: string): Promise<number> {
    
    if (!password) throw new Error('Encryption key is missed.');

    if (payload == null) throw new Error('Missing payload.');
    payload = String(payload).trim();

    if (payload === null || payload === "") return 0;

    try {
      if (/%[0-9A-Fa-f]{2}/.test(payload)) {
        payload = decodeURIComponent(payload);
      }
    } catch {
    }

    const parts = payload.split('.').map(p => p.trim()).filter(p => p.length > 0);

    if (parts.length !== 3) {
      throw new Error('Invalid format. Expected "salt.iv.cipher" (base64).');
    }

    const [saltB64, ivB64, cipherB64] = parts;

    const salt = this.fromBase64(saltB64);
    const iv = this.fromBase64(ivB64);
    const cipherBytes = this.fromBase64(cipherB64);

    if (salt.length !== 16) throw new Error('Invalid salt length. Expected 16 bytes.');
    if (iv.length !== 12) throw new Error('Invalid IV length. Expected 12 bytes for AES-GCM.');

    const key = await this.deriveKey(password, salt);

    let plainBuffer: ArrayBuffer;
    try {
      plainBuffer = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipherBytes);
    } catch {
      throw new Error('Corrupted data or wrong password.');
    }

    const text = this.decoder.decode(plainBuffer);
    const num = Number(text);
    if (!Number.isFinite(num)) throw new Error('Invalid Number.');
    return num;
  }

  private async deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      this.encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100_000, 
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );

  }

 
  private toBase64(bytes: Uint8Array): string {
    let binary = '';
    const chunkSize = 0x8000; 
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode(...chunk);
    }
    return btoa(binary);
  }


  private fromBase64(b64: string): Uint8Array {
   
    if (!b64) throw new Error('Empty base64 input');

    if (b64.startsWith('data:')) {
      const parts = b64.split(',');
      if (parts.length < 2) throw new Error('Malformed data URL');
      b64 = parts.slice(1).join(',');
    }

    b64 = b64.replace(/\s+/g, '');

    if (/-|_/.test(b64)) {
      b64 = b64.replace(/-/g, '+').replace(/_/g, '/');
    }

    const mod = b64.length % 4;
    if (mod === 2) b64 += '==';
    else if (mod === 3) b64 += '=';
    else if (mod === 1) throw new Error('Invalid base64 length');
    
    let binary: string;
    try {
      binary = atob(b64);
    } catch (e) {
      console.error('fromBase64 failed. Sample:', b64.slice(0, 32));
      throw new Error('Invalid base64 content');
    }

    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

}

