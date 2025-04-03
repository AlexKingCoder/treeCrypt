/**
 * Caracteres base para los diccionarios de encriptación
 */
export const BASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

/**
 * Tamaño de bloque para la fragmentación
 */
export const BLOCK_SIZE = 512;

/**
 * Tamaño del padding para cada bloque
 */
export const PADDING_SIZE = 64;

/**
 * Tamaño de la clave XOR
 */
export const XOR_KEY_SIZE = 128;

/**
 * Tamaño del ruido entre bloques
 */
export const NOISE_SIZE = 128;

/**
 * Número de diccionarios de encriptación
 */
export const NUM_DICTIONARIES = 12;

// Tamaño de la semilla para generación de números aleatorios
export const SEED_SIZE = 16; 