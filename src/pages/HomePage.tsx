import React from 'react';
import { Box, Typography, Container, Grid, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import encryptionIcon from '../assets/encryption.svg';
import securityIcon from '../assets/security.svg';
import interfaceIcon from '../assets/interface.svg';

const FeatureCard = ({ 
    title, 
    description, 
    image, 
    showArrow = false 
}: { 
    title: string; 
    description: string; 
    image: string; 
    showArrow?: boolean;
}) => {
    const theme = useTheme();
    
    return (
        <Box sx={{ position: 'relative' }}>
            <Box
                sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                    boxShadow: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                }}
            >
                <Box
                    component="img"
                    src={image}
                    alt={title}
                    sx={{
                        width: '120px',
                        height: '120px',
                        mb: 2,
                        objectFit: 'contain'
                    }}
                />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {description}
                </Typography>
            </Box>
            {showArrow && (
                <Box
                    sx={{
                        position: 'absolute',
                        right: '-40px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        display: { xs: 'none', md: 'block' }
                    }}
                >
                    <svg
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={theme.palette.primary.main}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </Box>
            )}
        </Box>
    );
};

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    const features = [
        {
            title: 'Encriptación Única',
            description: 'Nuestro sistema utiliza 12 núcleos procedurales para encriptar tus archivos, además de incluir otras 5 capas de seguridad adicionales en el proceso.',
            image: encryptionIcon
        },
        {
            title: 'Llave de Seguridad',
            description: 'Además de tu archivo encriptado, recibirás una llave de seguridad para poder abrirlo. También implementamos verificaciones de integridad para evitar que el archivo sea alterado.',
            image: securityIcon
        },
        {
            title: 'Interfaz Intuitiva',
            description: 'Simplemente sube tu archivo y elige una contraseña. ¡Nosotros nos encargamos de todo!.',
            image: interfaceIcon
        }
    ];

    return (
        <Container maxWidth="lg">
            <Box
                sx={{
                    py: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4
                }}
            >
                <Typography
                    variant="h2"
                    component="h1"
                    sx={{
                        fontWeight: 'bold',
                        textAlign: 'center',
                        mb: 2,
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent'
                    }}
                >
                    TreeCrypt
                </Typography>
                
                <Typography
                    variant="h5"
                    sx={{
                        textAlign: 'center',
                        color: 'text.secondary',
                        mb: 6
                    }}
                >
                    Encriptación genuina de alto nivel
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4, mt: 2 }}>
                    {features.map((feature, index) => (
                        <Box key={index}>
                            <FeatureCard
                                {...feature}
                                showArrow={index < features.length - 1}
                            />
                        </Box>
                    ))}
                </Box>

                <Box sx={{ mt: 6, display: 'flex', gap: 2 }}>
                    <Box
                        component="button"
                        onClick={() => navigate('/encrypt')}
                        sx={{
                            px: 4,
                            py: 2,
                            borderRadius: 2,
                            bgcolor: 'primary.main',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                bgcolor: 'primary.dark',
                                transform: 'translateY(-2px)'
                            }
                        }}
                    >
                        Encriptar Archivo
                    </Box>
                    <Box
                        component="button"
                        onClick={() => navigate('/decrypt')}
                        sx={{
                            px: 4,
                            py: 2,
                            borderRadius: 2,
                            bgcolor: 'background.paper',
                            color: 'primary.main',
                            border: '2px solid',
                            borderColor: 'primary.main',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                bgcolor: 'primary.main',
                                color: 'white',
                                transform: 'translateY(-2px)'
                            }
                        }}
                    >
                        Desencriptar Archivo
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default HomePage; 