import { BLOCK_SIZE, PADDING_SIZE } from './constants';

/**
 * Procesa los bytes aplicando rotación y distribución de bits
 */
export const processBytes = (data: Uint8Array, rotationValues: number[]): Uint8Array => {
    const result = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) {
        let byte = data[i];
        // Primero aplicamos la rotación
        const rotation = rotationValues[i % rotationValues.length];
        byte = rotateBits(byte, rotation);
        // Luego distribuimos los bits
        byte = spreadBits(byte);
        result[i] = byte;
    }
    return result;
};

/**
 * Procesa los bytes en reversa (desencriptación)
 */
export const reverseProcessBytes = (data: Uint8Array, rotationValues: number[]): Uint8Array => {
    const result = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) {
        let byte = data[i];
        // Primero deshacemos la distribución de bits
        byte = unspreadBits(byte);
        // Luego deshacemos la rotación
        const rotation = rotationValues[i % rotationValues.length];
        byte = rotateBits(byte, (8 - rotation) & 0x7);
        result[i] = byte;
    }
    return result;
};

/**
 * Rota los bits de un byte hacia la izquierda
 */
const rotateBits = (byte: number, count: number): number => {
    return ((byte << count) | (byte >>> (8 - count))) & 0xFF;
};

/**
 * Distribuye los bits de un byte para aumentar la entropía
 */
const spreadBits = (byte: number): number => {
    let result = 0;
    for (let i = 0; i < 8; i++) {
        const bit = (byte >> i) & 1;
        result |= (bit << ((i * 3) % 8));
    }
    return result;
};

/**
 * Revierte la distribución de bits de un byte
 */
const unspreadBits = (byte: number): number => {
    let result = 0;
    for (let i = 0; i < 8; i++) {
        const bit = (byte >> ((i * 3) % 8)) & 1;
        result |= (bit << i);
    }
    return result;
};

/**
 * Fragmenta y añade ruido a los datos
 */
export const fragmentAndAddNoise = (
    data: Uint8Array,
    blockOrder: number[],
    secondaryBlockOrder: number[],
    noisePositions: number[],
    paddingSizes: number[]
): Uint8Array => {
    const numBlocks = Math.ceil(data.length / 512); // BLOCK_SIZE
    const blocks: Uint8Array[] = [];
    let totalSize = 0;

    for (let i = 0; i < numBlocks; i++) {
        const start = i * 512; // BLOCK_SIZE
        const end = Math.min(start + 512, data.length); // BLOCK_SIZE
        const block = data.slice(start, end);
        
        const paddingSize = paddingSizes[i];
        const paddedBlock = new Uint8Array(block.length + paddingSize);
        paddedBlock.set(block);
        paddedBlock.set(new Uint8Array(paddingSize).map(() => Math.floor(Math.random() * 256)), block.length);
        
        blocks.push(paddedBlock);
        totalSize += paddedBlock.length + 128; // NOISE_SIZE
    }

    let reorderedBlocks = blockOrder.map(index => blocks[index]);
    reorderedBlocks = secondaryBlockOrder.map(index => reorderedBlocks[index]);

    const result = new Uint8Array(totalSize);
    let position = 0;

    reorderedBlocks.forEach((block, i) => {
        const noise = new Uint8Array(128).map(() => Math.floor(Math.random() * 256)); // NOISE_SIZE
        noisePositions[i] = position;
        
        result.set(noise, position);
        position += 128; // NOISE_SIZE
        
        result.set(block, position);
        position += block.length;
    });

    return result;
};

/**
 * Elimina el ruido y reordena los bloques
 */
export const removeNoiseAndDefragment = (
    data: Uint8Array,
    blockOrder: number[],
    secondaryBlockOrder: number[],
    noisePositions: number[],
    paddingSizes: number[]
): Uint8Array => {
    const blocks: Uint8Array[] = [];
    let totalOriginalSize = 0;
    
    for (let i = 0; i < noisePositions.length; i++) {
        const noisePos = noisePositions[i];
        const blockStart = noisePos + 128; // NOISE_SIZE
        const blockEnd = i < noisePositions.length - 1 
            ? noisePositions[i + 1] 
            : data.length;
        
        const block = data.slice(blockStart, blockEnd);
        const originalSize = block.length - paddingSizes[i];
        const originalBlock = block.slice(0, originalSize);
        
        blocks.push(originalBlock);
        totalOriginalSize += originalBlock.length;
    }
    
    // Deshacer la segunda capa de permutación
    const inverseSecondaryOrder = new Array(secondaryBlockOrder.length);
    secondaryBlockOrder.forEach((pos, index) => {
        inverseSecondaryOrder[pos] = index;
    });
    let unshuffledBlocks = inverseSecondaryOrder.map(index => blocks[index]);
    
    // Deshacer la primera capa de permutación
    const inverseOrder = new Array(blockOrder.length);
    blockOrder.forEach((pos, index) => {
        inverseOrder[pos] = index;
    });
    unshuffledBlocks = inverseOrder.map(index => unshuffledBlocks[index]);
    
    // Concatenar los bloques
    const result = new Uint8Array(totalOriginalSize);
    let position = 0;
    
    unshuffledBlocks.forEach(block => {
        result.set(block, position);
        position += block.length;
    });
    
    return result;
}; 