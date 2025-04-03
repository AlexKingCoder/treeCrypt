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
import { encryptFile } from '../utils/encryption';
import { KeyFile } from '../utils/types';

interface EncryptionResult {
    fileName: string;
    encryptedData: ArrayBuffer;
    keyFile: KeyFile;
}

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB en bytes

const EncryptPage: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<EncryptionResult | null>(null);
    const [progress, setProgress] = useState<{ stage: string; value: number } | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const handleFileSelect = useCallback((file: File) => {
        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                setError('El archivo excede el tamaño máximo permitido de 20MB');
                setSelectedFile(null);
                return;
            }
            setSelectedFile(file);
            setError('');
        }
    }, []);

    const handleEncrypt = async () => {
        if (!selectedFile) {
            setError('Por favor, selecciona un archivo');
            return;
        }

        if (!password) {
            setError('Por favor, ingresa una contraseña');
            return;
        }

        if (password.length < 4) {
            setPasswordError('Para mayor seguridad, la contraseña debe tener al menos 4 caracteres');
            return;
        }

        if (password !== confirmPassword) {
            setPasswordError('Las contraseñas no coinciden');
            return;
        }

        setIsProcessing(true);
        setError(null);
        setPasswordError(null);
        setProgress({ stage: 'Iniciando...', value: 0 });

        try {
            const { encryptedData, keyFile } = await encryptFile(
                selectedFile, 
                password,
                (stage, value) => setProgress({ stage, value })
            );
            
            setResult({
                fileName: selectedFile.name,
                encryptedData,
                keyFile
            });
        } catch (err) {
            setError('Error al encriptar el archivo: ' + (err instanceof Error ? err.message : 'Error desconocido'));
        } finally {
            setIsProcessing(false);
            setProgress(null);
        }
    };

    const downloadFile = (content: ArrayBuffer | string, fileName: string, type: string) => {
        const blob = new Blob([content], { type });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const handleDownloadEncrypted = () => {
        if (!result) return;
        downloadFile(result.encryptedData, `${result.fileName}.tree`, 'application/octet-stream');
    };

    const handleDownloadKey = () => {
        if (!result) return;
        downloadFile(JSON.stringify(result.keyFile), `${result.fileName}.key`, 'application/json');
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Encriptar Archivo
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Paper sx={{ p: 3, mb: 3 }}>
                    <FileDropZone
                        onFileSelect={handleFileSelect}
                        title="Selecciona el archivo para encriptar"
                        accept={['*']}
                    />
                    {selectedFile && (
                        <Typography sx={{ mt: 2 }}>
                            Archivo seleccionado: {selectedFile.name}
                        </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        Tamaño máximo permitido: 20MB
                    </Typography>
                </Paper>

                <Paper sx={{ p: 3, mb: 3 }}>
                    <TextField
                        fullWidth
                        type="password"
                        label="Contraseña para el archivo llave"
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
                        onClick={handleEncrypt}
                        disabled={isProcessing || !selectedFile || !password || !confirmPassword}
                        fullWidth
                    >
                        {isProcessing ? <CircularProgress size={24} color="inherit" /> : 'Encriptar'}
                    </Button>
                    {progress && (
                        <Box sx={{ width: '100%', mt: 2 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                {progress.stage}
                            </Typography>
                            <LinearProgress 
                                variant="determinate" 
                                value={progress.value * 100} 
                                sx={{ height: 8, borderRadius: 4 }}
                            />
                        </Box>
                    )}
                </Paper>

                {result && (
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            ¡Archivo encriptado con éxito!
                        </Typography>

                        <Box sx={{ mt: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleDownloadEncrypted}
                                fullWidth
                                sx={{ mb: 2 }}
                            >
                                Descargar Archivo Encriptado
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleDownloadKey}
                                fullWidth
                            >
                                Descargar Archivo Llave
                            </Button>
                            <Alert severity="warning" sx={{ mt: 2 }}>
                                ¡Importante! Guarda el archivo llave y la contraseña en un lugar seguro.
                                Los necesitarás para desencriptar el archivo.
                            </Alert>
                        </Box>
                    </Paper>
                )}
            </Box>
        </Container>
    );
};

export default EncryptPage; 