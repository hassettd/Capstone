// modified to bypass CORS
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://capstone-backend2-2gcs.onrender.com", 
        changeOrigin: true,
        secure: false, // Set this to true if the target API uses HTTPS
      },
    },
  },
});


