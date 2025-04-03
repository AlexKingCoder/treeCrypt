import { BASE_CHARS, NUM_DICTIONARIES } from './constants';

/**
 * Genera un diccionario de encriptación
 */
export const generateEncryptionDictionary = (): Record<string, string> => {
    const dictionary: Record<string, string> = {};
    const chars = BASE_CHARS.split('');
    const shuffledChars = [...chars];
    
    // Mezclar caracteres de forma segura
    for (let i = shuffledChars.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledChars[i], shuffledChars[j]] = [shuffledChars[j], shuffledChars[i]];
    }
    
    chars.forEach((char: string, index: number) => {
        dictionary[char] = shuffledChars[index];
    });
    
    return dictionary;
};

/**
 * Genera diccionarios de encriptación
 */
export const generateEncryptionDictionaries = (password: string): Record<string, string>[] => {
    return Array.from({ length: NUM_DICTIONARIES }, () => generateEncryptionDictionary());
};

/**
 * Genera un orden aleatorio para los diccionarios
 */
export const generateDictionaryOrder = (password: string): number[] => {
    const order = Array.from({ length: NUM_DICTIONARIES }, (_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
};

/**
 * Crea un diccionario inverso
 */
export const createReverseDictionary = (dictionary: Record<string, string>): Record<string, string> => {
    const reverseDict: Record<string, string> = {};
    Object.entries(dictionary).forEach(([key, value]) => {
        reverseDict[value] = key;
    });
    return reverseDict;
};

/**
 * Aplica un diccionario a un string
 */
export const applyDictionary = (content: string, dictionary: Record<string, string>): string => {
    return content.split('').map(char => dictionary[char] || char).join('');
}; 