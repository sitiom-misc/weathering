import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "io.github.sitiom.weathering",
  appName: "Weathering",
  webDir: "dist",
  server: {
    // For local development
    // url: "http://localhost:5173/",
    // cleartext: true,
    androidScheme: "https",
  },
};

export default config;
