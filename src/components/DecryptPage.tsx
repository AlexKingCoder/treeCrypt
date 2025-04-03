import React, { useState, useCallback } from 'react';
import { Box, Button, TextField, Typography, CircularProgress, Alert } from '@mui/material';
import { decryptFile } from '../utils/encryption';
import { KeyFile, ProgressCallback } from '../utils/types';

export const DecryptPage: React.FC = () => {
    const [encryptedFile, setEncryptedFile] = useState<File | null>(null);
    const [keyFile, setKeyFile] = useState<KeyFile | null>(null);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [progressMessage, setProgressMessage] = useState('');

    const handleEncryptedFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setEncryptedFile(selectedFile);
            setError(null);
        }
    };

    const handleKeyFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            try {
                const text = await selectedFile.text();
                const parsedKeyFile = JSON.parse(text) as KeyFile;
                setKeyFile(parsedKeyFile);
                setError(null);
            } catch (err) {
                setError('Error al leer el archivo de llave');
            }
        }
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
        setError(null);
    };

    const handleProgress: ProgressCallback = useCallback((message: string, progress: number) => {
        setProgressMessage(message);
        setProgress(progress);
    }, []);

    const handleDecrypt = async () => {
        if (!encryptedFile) {
            setError('Por favor, selecciona el archivo encriptado');
            return;
        }

        if (!keyFile) {
            setError('Por favor, selecciona el archivo de llave');
            return;
        }

        if (!password) {
            setError('Por favor, ingresa la contraseña');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const encryptedData = await encryptedFile.arrayBuffer();
            const decryptedData = await decryptFile(encryptedData, keyFile, password, handleProgress);

            // Crear el archivo desencriptado
            const decryptedBlob = new Blob([decryptedData], { type: keyFile.mimeType });
            const decryptedUrl = URL.createObjectURL(decryptedBlob);
            const decryptedLink = document.createElement('a');
            decryptedLink.href = decryptedUrl;
            decryptedLink.download = encryptedFile.name.replace('.tree', '');
            document.body.appendChild(decryptedLink);
            decryptedLink.click();
            document.body.removeChild(decryptedLink);
            URL.revokeObjectURL(decryptedUrl);

            setProgressMessage('Desencriptación completada');
            setProgress(1);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error durante la desencriptación');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Desencriptar Archivo
            </Typography>

            <Box sx={{ mb: 3 }}>
                <Button
                    variant="contained"
                    component="label"
                    fullWidth
                    sx={{ mb: 2 }}
                >
                    Seleccionar Archivo Encriptado
                    <input
                        type="file"
                        hidden
                        accept=".tree"
                        onChange={handleEncryptedFileChange}
                    />
                </Button>
                {encryptedFile && (
                    <Typography variant="body2" color="text.secondary">
                        Archivo seleccionado: {encryptedFile.name}
                    </Typography>
                )}
            </Box>

            <Box sx={{ mb: 3 }}>
                <Button
                    variant="contained"
                    component="label"
                    fullWidth
                    sx={{ mb: 2 }}
                >
                    Seleccionar Archivo de Llave
                    <input
                        type="file"
                        hidden
                        accept=".key"
                        onChange={handleKeyFileChange}
                    />
                </Button>
                {keyFile && (
                    <Typography variant="body2" color="text.secondary">
                        Archivo de llave seleccionado
                    </Typography>
                )}
            </Box>

            <TextField
                fullWidth
                type="password"
                label="Contraseña"
                value={password}
                onChange={handlePasswordChange}
                margin="normal"
                required
            />

            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}

            {loading && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <CircularProgress variant="determinate" value={progress * 100} />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {progressMessage}
                    </Typography>
                </Box>
            )}

            <Button
                fullWidth
                variant="contained"
                onClick={handleDecrypt}
                disabled={!encryptedFile || !keyFile || !password || loading}
                sx={{ mt: 3 }}
            >
                Desencriptar
            </Button>
        </Box>
    );
}; 