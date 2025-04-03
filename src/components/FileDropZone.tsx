import React, { useCallback } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useDropzone } from 'react-dropzone';

interface FileDropZoneProps {
    onFileSelect: (file: File) => void;
    accept?: string[];
    title?: string;
}

const FileDropZone: React.FC<FileDropZoneProps> = ({ 
    onFileSelect, 
    accept = [], 
    title = 'Arrastra un archivo o haz clic para seleccionarlo' 
}) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            onFileSelect(acceptedFiles[0]);
        }
    }, [onFileSelect]);

    // Convertir las extensiones a un objeto de tipos MIME
    const getAcceptedTypes = () => {
        if (accept.length === 0) {
            return undefined; // Acepta todos los tipos de archivo
        }

        return accept.reduce((acc: Record<string, string[]>, curr) => {
            if (curr === '*') {
                return acc; // Ignoramos el asterisco, ya que undefined acepta todos los tipos
            }
            if (curr.startsWith('.')) {
                // Para archivos .encrypted y .key, usamos application/octet-stream
                // y también permitimos la extensión específica
                acc['application/octet-stream'] = [];
                // Añadimos la extensión al objeto de tipos aceptados
                const extensionType = `application/${curr.slice(1)}`;
                acc[extensionType] = [curr];
            } else {
                // Si es un tipo MIME, lo usamos directamente
                acc[curr] = [];
            }
            return acc;
        }, {});
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
        onDrop,
        accept: getAcceptedTypes(),
        multiple: false,
        useFsAccessApi: false // Deshabilitamos la API de acceso al sistema de archivos para mayor compatibilidad
    });

    return (
        <Paper
            {...getRootProps()}
            sx={{
                p: 3,
                border: '2px dashed',
                borderColor: isDragActive ? 'primary.main' : 'grey.500',
                bgcolor: isDragActive ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'rgba(76, 175, 80, 0.1)'
                }
            }}
        >
            <input {...getInputProps()} />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '150px'
                }}
            >
                <Typography variant="h6" align="center" gutterBottom>
                    {isDragActive ? '¡Suelta el archivo aquí!' : title}
                </Typography>
                <Typography variant="body2" color="textSecondary" align="center">
                    {isDragActive 
                        ? 'Suelta el archivo para comenzar' 
                        : 'O haz clic para seleccionar un archivo'}
                </Typography>
                {accept && accept.length > 0 && (
                    <Typography variant="caption" color="textSecondary" align="center" sx={{ mt: 1 }}>
                        Tipos de archivo aceptados: {accept.join(', ')}
                    </Typography>
                )}
            </Box>
        </Paper>
    );
};

export default FileDropZone; 