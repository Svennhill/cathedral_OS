# App icon and splash sources: PLACEHOLDERS

**Every image in this folder is a placeholder.** Each one says "PLACEHOLDER" on
its face. Replace all of them with final art before any store submission.

This folder is used only for the Android and iOS apps. The web app and the Vercel
deploy never read it. (Vite serves only `public/`.)

| File | Size | Purpose |
|---|---|---|
| `icon-only.png` | 1024×1024, no transparency | Main app icon (iOS, and the Android fallback) |
| `icon-foreground.png` | 1024×1024, transparent | Android adaptive icon foreground layer. Keep the art inside the center ~66%. |
| `icon-background.png` | 1024×1024 | Android adaptive icon background layer |
| `splash.png` | 2732×2732 | Launch/splash screen. Keep the art inside the center ~1200×1200. |
| `splash-dark.png` | 2732×2732 | Launch/splash screen in dark mode |

## Generating the native icon and splash sets

After you replace the art, run this from the repo root on your own machine:

```bash
npx @capacitor/assets generate --assetPath resources
```

That tool is not installed in this repo on purpose. `npx` fetches it on demand.
It writes the platform icon and splash sets into `android/app/src/main/res/` and
`ios/App/App/Assets.xcassets/`. Those folders currently hold Capacitor's stock
default icons, which are also placeholders.
