
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('Main.tsx loaded - starting React app');
console.log('Current location:', window.location.href);
console.log('Environment:', import.meta.env.MODE);

createRoot(document.getElementById("root")!).render(<App />);
