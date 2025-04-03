import CryptoJS from 'crypto-js';
import { KeyFile, ProgressCallback } from './types';
import { calculateEntropy } from './entropy';
import { processBytes, reverseProcessBytes, fragmentAndAddNoise, removeNoiseAndDefragment } from './byteProcessing';
import { generateEncryptionDictionaries, generateDictionaryOrder, createReverseDictionary, applyDictionary } from './dictionary';
import { 
    calculateFileHash, 
    verifyByteIntegrity, 
    generateRandomBytes, 
    generateRandomOrder,
    arrayBufferToString,
    stringToArrayBuffer,
    ensureArrayBuffer
} from './fileOperations';
import { BLOCK_SIZE, PADDING_SIZE, XOR_KEY_SIZE } from './constants';

const BATCH_SIZE = 1024 * 1024; // 1MB por lote

/**
 * Procesa un array de bytes en lotes
 */
const processInBatches = async (
    data: Uint8Array,
    processFn: (batch: Uint8Array) => Uint8Array,
    onProgress: ProgressCallback,
    stage: string
): Promise<Uint8Array> => {
    const numBatches = Math.ceil(data.length / BATCH_SIZE);
    const result = new Uint8Array(data.length);
    
    for (let i = 0; i < numBatches; i++) {
        const start = i * BATCH_SIZE;
        const end = Math.min(start + BATCH_SIZE, data.length);
        const batch = data.slice(start, end);
        
        // Procesar el lote
        const processedBatch = processFn(batch);
        result.set(processedBatch, start);
        
        // Actualizar progreso
        onProgress(stage, (i + 1) / numBatches);
        
        // Permitir que la UI se actualice
        await new Promise(resolve => setTimeout(resolve, 0));
    }
    
    return result;
};

/**
 * Encripta un archivo usando el algoritmo TreeCript
 */
export async function encryptFile(
    file: File,
    password: string,
    onProgress?: ProgressCallback
): Promise<{ encryptedData: ArrayBuffer; keyFile: KeyFile }> {
    // Leer el archivo
    const fileBuffer = await file.arrayBuffer();
    const fileBytes = new Uint8Array(fileBuffer);
    
    // Generar diccionarios de encriptación
    onProgress?.('Generando diccionarios', 0.1);
    const dictionaries = generateEncryptionDictionaries(password);
    const order = generateDictionaryOrder(password);
    
    // Aplicar XOR en lotes
    onProgress?.('Aplicando XOR', 0.2);
    const xorKey = generateRandomBytes(XOR_KEY_SIZE);
    const xorBytes = await processInBatches(
        fileBytes,
        (batch) => {
            const result = new Uint8Array(batch.length);
            for (let i = 0; i < batch.length; i++) {
                result[i] = batch[i] ^ xorKey[i % XOR_KEY_SIZE];
    }
    return result;
        },
        (stage, progress) => onProgress?.(stage, 0.2 + progress * 0.1),
        'Aplicando XOR'
    );
    
    // Procesar bytes en lotes
    onProgress?.('Procesando bytes', 0.3);
    const processedBytes = await processInBatches(
        xorBytes,
        (batch) => processBytes(batch, [1, 2, 3, 4, 5, 6, 7, 8]),
        (stage, progress) => onProgress?.(stage, 0.3 + progress * 0.1),
        'Procesando bytes'
    );

    // Fragmentar y añadir ruido
    onProgress?.('Fragmentando datos', 0.4);
    const blockOrder = generateRandomOrder(Math.ceil(processedBytes.length / BLOCK_SIZE));
    const secondaryBlockOrder = generateRandomOrder(blockOrder.length);
    const noisePositions: number[] = [];
    const paddingSizes = Array(blockOrder.length).fill(PADDING_SIZE);

    const fragmentedData = fragmentAndAddNoise(
        processedBytes,
        blockOrder,
        secondaryBlockOrder,
        noisePositions,
        paddingSizes
    );
    
    // Aplicar diccionarios en lotes
    onProgress?.('Aplicando núcleos procedurales', 0.5);
    const buffer = new ArrayBuffer(fragmentedData.buffer.byteLength);
    new Uint8Array(buffer).set(new Uint8Array(fragmentedData.buffer));
    let currentData = arrayBufferToString(buffer);
    
    for (let i = 0; i < dictionaries.length; i++) {
        currentData = applyDictionary(currentData, dictionaries[order[i]]);
        onProgress?.('Aplicando núcleos procedurales', 0.5 + (i + 1) / dictionaries.length * 0.2);
        await new Promise(resolve => setTimeout(resolve, 0));
    }
    
    // Calcular entropía
    onProgress?.('Calculando entropía', 0.7);
    const entropyStats = calculateEntropy(new Uint8Array(stringToArrayBuffer(currentData)));

    // Crear archivo llave
    onProgress?.('Generando archivo llave', 0.8);
    const keyFile: KeyFile = {
        dictionaries,
        order,
        timestamp: Date.now(),
        fileHash: await calculateFileHash(fileBuffer),
        mimeType: file.type,
        blockOrder,
        secondaryBlockOrder,
        noisePositions,
        xorKey: Array.from(xorKey),
        rotationValues: [1, 2, 3, 4, 5, 6, 7, 8],
        paddingSizes
    };

    // Verificar integridad
    onProgress?.('Verificando integridad', 0.9);
    const finalBytes = new Uint8Array(stringToArrayBuffer(currentData));
    verifyByteIntegrity(finalBytes, 'post-diccionarios');
    
    onProgress?.('Encriptación completada', 1);
    
    return {
        encryptedData: finalBytes.buffer,
        keyFile
    };
}

/**
 * Desencripta un archivo usando el algoritmo TreeCript
 */
export async function decryptFile(
    encryptedData: ArrayBuffer,
    keyFile: KeyFile,
    password: string,
    onProgress?: ProgressCallback
): Promise<ArrayBuffer> {
    // Verificar integridad inicial
    onProgress?.('Verificando integridad inicial', 0.1);
    const encryptedBytes = new Uint8Array(encryptedData);
    verifyByteIntegrity(encryptedBytes, 'inicio');
    
    // Aplicar diccionarios en orden inverso
    onProgress?.('Aplicando núcleos procedurales inversos', 0.2);
    let currentData = arrayBufferToString(encryptedData);
    for (let i = keyFile.order.length - 1; i >= 0; i--) {
        const reverseDict = createReverseDictionary(keyFile.dictionaries[keyFile.order[i]]);
        currentData = applyDictionary(currentData, reverseDict);
        onProgress?.('Aplicando núcleos procedurales inversos', 0.2 + (keyFile.order.length - i) / keyFile.order.length * 0.2);
        await new Promise(resolve => setTimeout(resolve, 0));
    }
    
    // Eliminar ruido y desfragmentar
    onProgress?.('Eliminando ruido', 0.4);
    const defragmentedData = removeNoiseAndDefragment(
        new Uint8Array(stringToArrayBuffer(currentData)),
        keyFile.blockOrder,
        keyFile.secondaryBlockOrder,
        keyFile.noisePositions,
        keyFile.paddingSizes
    );
    verifyByteIntegrity(defragmentedData, 'post-defragmentación');
    
    // Revertir procesamiento de bytes en lotes
    onProgress?.('Revirtiendo procesamiento', 0.5);
    const unprocessedBytes = await processInBatches(
        defragmentedData,
        (batch) => reverseProcessBytes(batch, keyFile.rotationValues),
        (stage, progress) => onProgress?.(stage, 0.5 + progress * 0.2),
        'Revirtiendo procesamiento'
    );
    verifyByteIntegrity(unprocessedBytes, 'post-procesamiento');
    
    // Aplicar XOR inverso en lotes
    onProgress?.('Aplicando XOR inverso', 0.7);
    const decryptedBytes = await processInBatches(
        unprocessedBytes,
        (batch) => {
            const result = new Uint8Array(batch.length);
            for (let i = 0; i < batch.length; i++) {
                result[i] = batch[i] ^ keyFile.xorKey[i % XOR_KEY_SIZE];
            }
            return result;
        },
        (stage, progress) => onProgress?.(stage, 0.7 + progress * 0.2),
        'Aplicando XOR inverso'
    );
    
    // Verificar integridad final
    onProgress?.('Verificando integridad final', 0.9);
    verifyByteIntegrity(decryptedBytes, 'post-xor');
    
    onProgress?.('Desencriptación completada', 1);
    
    return ensureArrayBuffer(decryptedBytes.buffer);
} 