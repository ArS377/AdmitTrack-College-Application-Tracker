import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google'

const CLIENT_ID = "320905813981-fp5i056hf7goql4lu0cencahhhifd6bi.apps.googleusercontent.com"

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId = {CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
)
