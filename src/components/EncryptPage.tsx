import React, { useState, useCallback } from 'react';
import { Box, Button, TextField, Typography, CircularProgress, Alert } from '@mui/material';
import { encryptFile } from '../utils/encryption';
import { ProgressCallback } from '../utils/types';

export const EncryptPage: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [progressMessage, setProgressMessage] = useState('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setError(null);
        }
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
        setError(null);
    };

    const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(event.target.value);
        setError(null);
    };

    const handleProgress: ProgressCallback = useCallback((message: string, progress: number) => {
        setProgressMessage(message);
        setProgress(progress);
    }, []);

    const handleEncrypt = async () => {
        if (!file) {
            setError('Por favor, selecciona un archivo');
            return;
        }

        if (!password) {
            setError('Por favor, ingresa una contraseña');
            return;
        }

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { encryptedData, keyFile } = await encryptFile(file, password, handleProgress);

            // Crear el archivo encriptado
            const encryptedBlob = new Blob([encryptedData], { type: 'application/octet-stream' });
            const encryptedUrl = URL.createObjectURL(encryptedBlob);
            const encryptedLink = document.createElement('a');
            encryptedLink.href = encryptedUrl;
            encryptedLink.download = `${file.name}.tree`;
            document.body.appendChild(encryptedLink);
            encryptedLink.click();
            document.body.removeChild(encryptedLink);
            URL.revokeObjectURL(encryptedUrl);

            // Crear el archivo de llave
            const keyBlob = new Blob([JSON.stringify(keyFile)], { type: 'application/json' });
            const keyUrl = URL.createObjectURL(keyBlob);
            const keyLink = document.createElement('a');
            keyLink.href = keyUrl;
            keyLink.download = `${file.name}.key`;
            document.body.appendChild(keyLink);
            keyLink.click();
            document.body.removeChild(keyLink);
            URL.revokeObjectURL(keyUrl);

            setProgressMessage('Encriptación completada');
            setProgress(1);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error durante la encriptación');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Encriptar Archivo
            </Typography>

            <Box sx={{ mb: 3 }}>
                <Button
                    variant="contained"
                    component="label"
                    fullWidth
                    sx={{ mb: 2 }}
                >
                    Seleccionar Archivo
                    <input
                        type="file"
                        hidden
                        onChange={handleFileChange}
                    />
                </Button>
                {file && (
                    <Typography variant="body2" color="text.secondary">
                        Archivo seleccionado: {file.name}
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

            <TextField
                fullWidth
                type="password"
                label="Confirmar Contraseña"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
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
                onClick={handleEncrypt}
                disabled={!file || !password || !confirmPassword || loading}
                sx={{ mt: 3 }}
            >
                Encriptar
            </Button>
        </Box>
    );
}; 