import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box, CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Navbar from './components/Navbar';
import EncryptPage from './pages/EncryptPage';
import DecryptPage from './pages/DecryptPage';
import HomePage from './pages/HomePage';
import logo from './assets/treeCrypt-Logo.jpeg';
import './styles/App.scss';

// Crear un tema personalizado
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4CAF50',
    },
    secondary: {
      main: '#2196F3',
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar logo={logo} />
        <Box component="main" sx={{ flexGrow: 1, p: 3, minHeight: 'calc(100vh - 64px)' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/encrypt" element={<EncryptPage />} />
            <Route path="/decrypt" element={<DecryptPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
        <Box component="footer" sx={{ py: 2, textAlign: 'center', bgcolor: 'background.paper' }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} TreeCrypt - Alex Gil Spencer (King Coder) - Todos los derechos reservados. No está permitida la reproducción, modificación o uso de esta aplicación fuera del ámbito público del autor.
          </Typography>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
