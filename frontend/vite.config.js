import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.API_base': JSON.stringify(env.API_base || env.api_base ),
      'process.env.api_base': JSON.stringify(env.API_base || env.api_base )
    },
    server: {
      proxy: {
        '/api': {
          target: env.API_base || env.api_base,
          changeOrigin: true,
          secure: false,
        }
      }
    }
  }
})
