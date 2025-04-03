/**
 * Tipo de callback para el progreso de la encriptación/desencriptación
 */
export type ProgressCallback = (message: string, progress: number) => void;

/**
 * Interfaz para el archivo de llave
 */
export interface KeyFile {
    dictionaries: Record<string, string>[];
    order: number[];
    timestamp: number;
    fileHash: string;
    mimeType: string;
    blockOrder: number[];
    secondaryBlockOrder: number[];
    noisePositions: number[];
    xorKey: number[];
    rotationValues: number[];
    paddingSizes: number[];
}

/**
 * Interfaz para el resultado del cálculo de entropía
 */
export interface EntropyResult {
    entropy: number;
    normalizedEntropy: number;
    distributionScore: number;
    correlationScore: number;
} 