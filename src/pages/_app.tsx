// src/pages/_app.tsx
import { AppProps } from 'next/app';
import { AuthProvider } from '../context/AuthContext';
import CssBaseline from '@mui/material/CssBaseline';
import '../app/globals.css';
import {ThemeProvider} from "@mui/material";
import {theme} from "../util/theme";


export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <AuthProvider>
            <CssBaseline />
            <ThemeProvider theme={theme}>
                <Component {...pageProps} />
            </ThemeProvider>
        </AuthProvider>
    );
}
