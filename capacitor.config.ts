import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.delegasi.capacitor",
  appName: "delegasi-capacitor",
  webDir: "public/build",
  bundledWebRuntime: false,
  server: {
    url: "http://192.168.0.106:3000",
    cleartext: true,
  },
  plugins: {
    DatePickerPlugin: {
      mode: "date",
      locale: "en_EN",
      current: "13/07/2019",
      format: "dd/MM/yyyy",
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
  android: {
    buildOptions: {},
  },
};

export default config;
