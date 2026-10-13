# FutureForge Ai By Passer

نسخهٔ شخصی FutureForge از افزونهٔ تشخیصی Google Flow. لوگو از [futureforge.ir](https://futureforge.ir) است.

## کار این نسخه
- پنجرهٔ روشن/خاموش دارد و درخواست‌های اخیر را همان‌جا نشان می‌دهد.
- لینک سایت، اینستاگرام و تلگرام FutureForge در پاپ‌آپ هست.
- روی `https://flow.google.com/*` محدود شده است.
- در حالت فعال، درخواست‌هایی را که URL آن‌ها شبیه `config`، `bootstrap`، `feature` یا `setting` باشد در پاپ‌آپ و Console ثبت می‌کند.
- پاسخ صفحه را تغییر نمی‌دهد.

## نصب
1. در Chrome برو به `chrome://extensions`.
2. Developer mode را روشن کن.
3. روی **Load unpacked** کلیک کن و پوشهٔ `FutureForge Ai By Passer` را انتخاب کن.
4. آیکون افزونه را باز کن. برای دیدن درخواست‌ها وارد Google Flow شو و ابزار را روشن کن.

## توسعهٔ TypeScript
```bash
npm install
npm run build
```
خروجی کامپایل `dist/content.js` و `dist/bridge.js` است. برای نصب محلی، اگر این دو فایل از قبل ساخته شده باشند، به Node.js نیاز نیست.

این پروژه مستقل است و وابستگی یا تأیید رسمی Google ندارد.
