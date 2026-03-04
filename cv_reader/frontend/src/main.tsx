import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Layout } from './hooks/useLayout.tsx'
import './index.css'

const theme = createTheme({
  typography: {
    h1: { fontSize: 'var(--font-size-h1)' },
    h2: { fontSize: 'var(--font-size-h2)' },
    h3: { fontSize: 'var(--font-size-h3)' },
    h4: { fontSize: 'var(--font-size-h4)' },
    h5: { fontSize: 'var(--font-size-h5)' },
    h6: { fontSize: 'var(--font-size-h6)' },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
        },
      },
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Layout>
          <App />
        </Layout>
      </ThemeProvider>
    </StyledEngineProvider>
  </StrictMode>,
)
