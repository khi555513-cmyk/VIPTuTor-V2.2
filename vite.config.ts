import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Polyfill process.env for client-side usage if needed by some libs, 
    // though ideally import.meta.env should be used. 
    // This maintains compatibility with the existing service code.
    'process.env': process.env
  }
})