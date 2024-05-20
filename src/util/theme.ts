import { createTheme } from '@mui/material/styles';

export const colors = {
  primary: '#0f1b41',
  primaryLight: '#213b8c',
  secondary: '#95c5f5',
  tertiary: '#FF5722',
  quaternary: '#795548',
  quinary: '#9E9E9E',
  senary: '#607D8B',
  white: '#FFFFFF',
  black: '#000000',
  grey: '#9E9E9E',
  error: '#FF0000',
  success: '#00FF00',
  warning: '#FFA500',
  info: '#0000FF',
  light: '#f1f1f1',
  dark: '#333',
};

export const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
      light: colors.primaryLight,
    },
    secondary: {
      main: colors.secondary,
    },
  },
  typography: {
    fontFamily: 'Montserrat, Arial, sans-serif',
  },
});