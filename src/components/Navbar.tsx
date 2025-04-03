import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

interface NavbarProps {
    logo: string;
}

const Navbar: React.FC<NavbarProps> = ({ logo }) => {
    return (
        <AppBar position="static">
            <Toolbar>
                <img 
                    src={logo} 
                    alt="TreeCrypt Logo" 
                    style={{ 
                        height: '40px', 
                        marginRight: '16px',
                        borderRadius: '4px'
                    }} 
                />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    TreeCrypt
                </Typography>
                <Box>
                    <Button color="inherit" component={Link} to="/">
                        Inicio
                    </Button>
                    <Button color="inherit" component={Link} to="/encrypt">
                        Encriptar
                    </Button>
                    <Button color="inherit" component={Link} to="/decrypt">
                        Desencriptar
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar; 