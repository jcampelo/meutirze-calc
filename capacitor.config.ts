import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.campelo.monjarodosei',
  appName: 'Monjaro Dose App',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
