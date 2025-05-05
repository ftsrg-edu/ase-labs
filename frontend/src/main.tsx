import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PrimeReactProvider } from 'primereact/api'
import App from './App.tsx'
import 'primereact/resources/themes/lara-light-cyan/theme.css'
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import './assets/index.css'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <PrimeReactProvider>
            <App />
        </PrimeReactProvider>
    </StrictMode>
)
