import { AppProps } from 'next/app';
import { AuthProvider } from '../context/AuthContext';
import CssBaseline from '@mui/material/CssBaseline';
import '../app/globals.css';
import { ThemeProvider } from '@mui/material';
import { theme } from '../util/theme';
import { SnackbarProvider } from 'notistack';

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <AuthProvider>
            <SnackbarProvider maxSnack={3}>
                <CssBaseline />
                <ThemeProvider theme={theme}>
                    <Component {...pageProps} />
                </ThemeProvider>
            </SnackbarProvider>
        </AuthProvider>
    );
}
