# NeYesem Mobile

Bu klasor, mevcut web frontend ile ayni backend mantigini kullanan React Native + Expo tabanli mobil frontend implementasyonudur.

## Kurulum

```bash
npm run setup
npm run start:fresh
```

`node_modules` silindiyse veya proje yeni klonlandiyse once mutlaka `npm run setup`
calistirin. Bu komut `package-lock.json` dosyasindaki kilitli surumlerle tum
bagimliliklari kurar. `npx expo install` tek basina proje kurulumu icin yeterli
degildir; Expo paketlerini eklemek veya uyumluluk kontrolu yapmak icin kullanilir.

Metro eski bir sureci veya Watchman onbellegini kullanirsa `react/jsx-dev-runtime`
ya da paket cozumleme hatalari gorulebilir. Bu durumda acik Expo/Metro
terminallerini kapatip `npm run start:fresh` calistirin; komut Watchman
onbellegini temizleyip Metro'yu temiz cache ile baslatir.

Kurulumu dogrulamak icin:

```bash
npm run doctor
npm run typecheck
```

## Notlar

- API tabani `src/config/app.ts` icinde tanimlidir.
- Auth token `expo-secure-store` ile saklanir.
- Web frontenddeki `Context + service` mimarisi mobilde korunmustur.
- Tarif gorseli ekleme akisi `expo-image-picker` ile cihaz galerisi uzerinden base64 payload'a donusturulur.
