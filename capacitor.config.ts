import type { CapacitorConfig } from '@capacitor/cli';

// Capacitor native-wrapper config for the Android and iOS apps.
// Read only by the Capacitor CLI (`npx cap sync`, `npx cap open ...`).
// Vite and the Vercel web deploy never load this file.
const config: CapacitorConfig = {
  appId: 'com.reliquarycodex.app',
  appName: 'Reliquary Codex',
  // The existing Vite build output. `npm run build` fills it; `npx cap sync`
  // copies it into android/ and ios/. The app itself is not changed.
  webDir: 'dist',
  // Native WebView background, shown for the instant before the page paints.
  // Black matches the app's own #000 container, so there is no white flash.
  backgroundColor: '#000000',
};

export default config;
