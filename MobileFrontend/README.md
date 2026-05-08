# NeYesem Mobile

Bu klasor, mevcut web frontend ile ayni backend mantigini kullanan React Native + Expo tabanli mobil frontend implementasyonudur.

## Kurulum

```bash
npm install
npm run start
```

## Notlar

- API tabani `src/config/app.ts` icinde tanimlidir.
- Auth token `expo-secure-store` ile saklanir.
- Web frontenddeki `Context + service` mimarisi mobilde korunmustur.
- Tarif gorseli ekleme akisi `expo-image-picker` ile cihaz galerisi uzerinden base64 payload'a donusturulur.
