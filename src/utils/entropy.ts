/**
 * Calcula la entropía de Shannon de un conjunto de bytes
 */
export const calculateEntropy = (data: Uint8Array): {
    entropy: number;
    normalizedEntropy: number;
    distributionScore: number;
    correlationScore: number;
} => {
    // Calcular frecuencias
    const frequencies = new Array(256).fill(0);
    for (let i = 0; i < data.length; i++) {
        frequencies[data[i]]++;
    }
    
    // Calcular entropía
    let entropy = 0;
    for (let i = 0; i < 256; i++) {
        if (frequencies[i] > 0) {
            const p = frequencies[i] / data.length;
            entropy -= p * Math.log2(p);
        }
    }
    
    // Calcular score de distribución
    const idealFreq = data.length / 256;
    let distributionScore = 0;
    for (let i = 0; i < 256; i++) {
        distributionScore += Math.abs(frequencies[i] - idealFreq) / data.length;
    }
    distributionScore = 1 - distributionScore;
    
    // Calcular correlación
    let correlation = 0;
    for (let i = 0; i < data.length - 1; i++) {
        correlation += Math.abs(data[i] - data[i + 1]) / 255;
    }
    const correlationScore = correlation / (data.length - 1);
    
    return {
        entropy,
        normalizedEntropy: entropy / 8,
        distributionScore,
        correlationScore
    };
}; 