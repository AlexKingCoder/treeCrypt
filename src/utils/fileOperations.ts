import CryptoJS from 'crypto-js';

/**
 * Calcula el hash de un archivo
 */
export const calculateFileHash = async (buffer: ArrayBuffer): Promise<string> => {
    const str = arrayBufferToString(buffer);
    return CryptoJS.SHA256(str).toString();
};

/**
 * Verifica la integridad de los bytes
 */
export function verifyByteIntegrity(bytes: Uint8Array, stage: string): void {
    let validBytes = 0;
    let invalidBytes = 0;

    for (let i = 0; i < bytes.length; i++) {
        if (bytes[i] >= 0 && bytes[i] <= 255) {
            validBytes++;
        } else {
            invalidBytes++;
        }
    }

    if (invalidBytes > 0) {
        throw new Error(`Integridad comprometida en ${stage}: ${invalidBytes} bytes inválidos`);
    }
}

/**
 * Crea un Uint8Array seguro
 */
export const createSafeUint8Array = (buffer: ArrayBuffer): Uint8Array => {
    return new Uint8Array(buffer);
};

/**
 * Asegura que el buffer sea un ArrayBuffer
 */
export const ensureArrayBuffer = (buffer: ArrayBufferLike): ArrayBuffer => {
    if (buffer instanceof ArrayBuffer) {
        return buffer;
    }
    return new ArrayBuffer(buffer.byteLength);
};

/**
 * Convierte un ArrayBuffer a string
 */
export const arrayBufferToString = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let result = '';
    for (let i = 0; i < bytes.length; i++) {
        result += String.fromCharCode(bytes[i]);
    }
    return result;
};

/**
 * Convierte un string a ArrayBuffer
 */
export const stringToArrayBuffer = (str: string): ArrayBuffer => {
    const bytes = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
        bytes[i] = str.charCodeAt(i);
    }
    return bytes.buffer;
};

/**
 * Genera bytes aleatorios criptográficamente seguros
 */
export const generateRandomBytes = (length: number): Uint8Array => {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return bytes;
};

/**
 * Genera un orden aleatorio para los bloques
 */
export const generateRandomOrder = (length: number): number[] => {
    const order = Array.from({ length }, (_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
}; 