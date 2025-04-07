import React, { useState, useCallback } from 'react';
import { 
    Container, 
    TextField, 
    Button, 
    Typography, 
    Paper,
    Box,
    Alert,
    CircularProgress,
    LinearProgress
} from '@mui/material';
import FileDropZone from '../components/FileDropZone';
import { decryptFile } from '../utils/encryption';
import { KeyFile } from '../utils/types';

interface DecryptedFile {
    content: ArrayBuffer;
    mimeType: string;
    fileName: string;
}

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB en bytes

const DecryptPage: React.FC = () => {
    const [encryptedFile, setEncryptedFile] = useState<File | null>(null);
    const [keyFile, setKeyFile] = useState<File | null>(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [decryptedFile, setDecryptedFile] = useState<DecryptedFile | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [progressMessage, setProgressMessage] = useState('');
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const handleEncryptedFileSelect = useCallback((file: File) => {
        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                setError('El archivo encriptado excede el tamaño máximo permitido de 20MB');
                setEncryptedFile(null);
                return;
            }
            setEncryptedFile(file);
            setError('');
        }
    }, []);

    const handleKeyFileSelect = useCallback((file: File) => {
        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                setError('El archivo de clave excede el tamaño máximo permitido de 20MB');
                setKeyFile(null);
                return;
            }
            setKeyFile(file);
            setError('');
        }
    }, []);

    const handleDecrypt = async () => {
        if (!encryptedFile || !keyFile || !password) {
            setError('Por favor, completa todos los campos');
            return;
        }

        if (password.length < 4) {
            setPasswordError('La contraseña debe tener al menos 4 caracteres');
            return;
        }

        if (password !== confirmPassword) {
            setPasswordError('Las contraseñas no coinciden');
            return;
        }

        setIsProcessing(true);
        setError(null);
        setProgress(0);
        setProgressMessage('');

        try {
            // Leer el archivo de llave
            const keyFileText = await keyFile.text();
            const parsedKeyFile = JSON.parse(keyFileText) as KeyFile;

            const decryptedData = await decryptFile(
                await encryptedFile.arrayBuffer(),
                parsedKeyFile,
                password,
                (message, progress) => {
                    setProgressMessage(message);
                    setProgress(progress);
                }
            );

            // Crear y descargar el archivo desencriptado
            const blob = new Blob([decryptedData], { type: parsedKeyFile.mimeType });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = encryptedFile.name.replace('.tree', '');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            setProgressMessage('Desencriptación completada');
            setProgress(1);

            setDecryptedFile({
                content: decryptedData,
                mimeType: parsedKeyFile.mimeType,
                fileName: encryptedFile.name.replace('.tree', '')
            });
        } catch (err) {
            if (err instanceof Error) {
                if (err.message === 'Contraseña incorrecta') {
                    setError('La contraseña proporcionada no es correcta');
                } else {
                    setError(`Error al desencriptar: ${err.message}`);
                }
            } else {
                setError('Error desconocido al desencriptar');
            }
            setProgress(0);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownloadDecrypted = () => {
        if (!decryptedFile) return;

        const blob = new Blob([decryptedFile.content], { type: decryptedFile.mimeType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = decryptedFile.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Desencriptar Archivo
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        1. Archivo Encriptado
                    </Typography>
                    <FileDropZone
                        onFileSelect={handleEncryptedFileSelect}
                        title="Selecciona el archivo encriptado"
                        accept={['.tree']}
                    />
                    {encryptedFile && (
                        <Typography sx={{ mt: 2 }}>
                            Archivo seleccionado: {encryptedFile.name}
                        </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        Tamaño máximo permitido: 20MB
                    </Typography>
                </Paper>

                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        2. Archivo Llave
                    </Typography>
                    <FileDropZone
                        onFileSelect={handleKeyFileSelect}
                        title="Selecciona el archivo llave"
                        accept={['.key']}
                    />
                    {keyFile && (
                        <Typography sx={{ mt: 2 }}>
                            Archivo seleccionado: {keyFile.name}
                        </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        Tamaño máximo permitido: 20MB
                    </Typography>
                </Paper>

                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        3. Contraseña
                    </Typography>
                    <TextField
                        fullWidth
                        type="password"
                        label="Contraseña del archivo llave"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setPasswordError(null);
                        }}
                        error={!!passwordError}
                        helperText={passwordError}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        type="password"
                        label="Confirmar contraseña"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setPasswordError(null);
                        }}
                        error={!!passwordError}
                        sx={{ mb: 2 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleDecrypt}
                        disabled={isProcessing || !encryptedFile || !keyFile || !password || !confirmPassword}
                        fullWidth
                    >
                        {isProcessing ? <CircularProgress size={24} color="inherit" /> : 'Desencriptar'}
                    </Button>
                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                    {progressMessage && (
                        <Box sx={{ width: '100%', mt: 2 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                {progressMessage}
                            </Typography>
                            <LinearProgress 
                                variant="determinate" 
                                value={progress * 100} 
                                sx={{ height: 8, borderRadius: 4 }}
                            />
                        </Box>
                    )}
                </Paper>

                {decryptedFile && (
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            ¡Archivo desencriptado con éxito!
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleDownloadDecrypted}
                                fullWidth
                            >
                                Descargar Archivo Desencriptado
                            </Button>
                        </Box>
                    </Paper>
                )}
            </Box>
        </Container>
    );
};

export default DecryptPage; 