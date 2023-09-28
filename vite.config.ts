import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base:"/computer-graphics-for-web-developer/",
  server:{
    host:"0.0.0.0",

  }

})
