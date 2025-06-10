import { defineConfig } from "vite";
import dns from "dns";
import react from "@vitejs/plugin-react";
import jsconfigPaths from "vite-jsconfig-paths";
import fs from "fs";
import tailwindcss from "@tailwindcss/vite";

dns.setDefaultResultOrder("verbatim");

// Clear specific environment variables
delete process.env["CommonProgramFiles(x86)"];
delete process.env["ProgramFiles(x86)"];

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDevelopment = mode === "development";

  return {
    plugins: [react(), jsconfigPaths(), tailwindcss()],
    server: isDevelopment
      ? {
          https: {
            key: fs.readFileSync("./certs/cert.key"), // Local server private key
            cert: fs.readFileSync("./certs/cert.crt"), // Local server certificate
            ca: fs.readFileSync("./certs/ca.crt"), // Optional: CA certificate
          },
          // host: "192.168.0.200",
          host: "0.0.0.0",
          port: 3011,
          open: true,
        }
      : {}, // No server-specific settings for production
    resolve: {
      alias: {
        "./runtimeConfig": "./runtimeConfig.browser",
      },
    },
    optimizeDeps: {
      include: ["process"],
      esbuildOptions: {
        define: {
          global: "globalThis",
        },
      },
    },
    rules: {
      "react/prop-types": 0,
    },
  };
});
