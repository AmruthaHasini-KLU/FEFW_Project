import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/ui.css'
import AppRoutes from './routes/AppRoutes'
import { AuthProvider } from './context/AuthContext'
import { SettingsProvider } from './context/SettingsContext'
// scrollReveal is loaded dynamically below after initial paint

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <SettingsProvider>
        <AppRoutes />
      </SettingsProvider>
    </AuthProvider>
  </StrictMode>,
)

// initialize scroll reveal after initial paint
if (typeof window !== 'undefined') {
  window.requestAnimationFrame(() => {
    import('./utils/scrollReveal').then(({ default: init }) => init({ once: true }));
  });
}
