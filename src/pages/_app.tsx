// src/pages/_app.tsx
import { AppProps } from 'next/app';
import { AuthProvider } from '../context/AuthContext';
import CssBaseline from '@mui/material/CssBaseline';

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <AuthProvider>
            <CssBaseline />
            <Component {...pageProps} />
        </AuthProvider>
    );
}
