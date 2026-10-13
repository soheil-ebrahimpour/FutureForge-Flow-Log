# FutureForge Flow Log

افزونهٔ کروم برای دیدن درخواست‌های پیکربندی [Google Flow](https://flow.google.com)، بدون دست زدن به پاسخ صفحه.

A Chrome extension that lists configuration-related requests on Google Flow. It keeps the URL, status code, and content type locally. It does not read response bodies, change responses, or send anything off the browser.

از [FutureForge](https://futureforge.ir).

## کار افزونه

افزونه فقط روی `https://flow.google.com/*` فعال است. بعد از روشن کردن، اگر نشانی یک درخواست شامل `config`، `bootstrap`، `feature` یا `setting` باشد، این‌ها ثبت می‌شود:

- نشانی درخواست
- کد وضعیت HTTP
- نوع محتوا (`Content-Type`)
- زمان مشاهده

حداکثر ۱۲ مورد اخیر در پنجرهٔ افزونه می‌ماند و همان رویداد در Console مرورگر هم نوشته می‌شود. پاسخ اصلی، دست‌نخورده به صفحه برمی‌گردد.

روشن یا خاموش بودن را خودتان انتخاب می‌کنید. با هر تغییر وضعیت، زبانه‌های باز Flow یک‌بار از نو بارگذاری می‌شوند تا قلاب شبکه با همان وضعیت کار کند.

## حریم خصوصی

داده از مرورگر شما خارج نمی‌شود.

| داده | محل نگهداری |
| --- | --- |
| نشانی، وضعیت، نوع محتوا، زمان | `chrome.storage.local`، حداکثر ۱۲ رکورد |
| روشن یا خاموش بودن | `chrome.storage.local` و یک پرچم در `localStorage` همان سایت |

بدنهٔ پاسخ خوانده نمی‌شود. FutureForge سروری برای دریافت این فهرست ندارد.

## دسترسی‌ها

| دسترسی | دلیل |
| --- | --- |
| `storage` | ذخیرهٔ وضعیت و فهرست اخیر روی همین دستگاه |
| `activeTab` و `scripting` | هم‌گام کردن وضعیت با زبانه‌های باز Flow |
| `https://flow.google.com/*` | تنها سایتی که افزونه روی آن اجرا می‌شود |

## نصب

Chrome یا یک مرورگر مبتنی بر Chromium کافی است. اگر `dist/content.js` و `dist/bridge.js` داخل پوشه باشند، برای نصب به Node.js نیاز نیست.

1. مخزن را دریافت کنید.
2. در نوار آدرس `chrome://extensions` را باز کنید.
3. حالت توسعه‌دهنده (Developer mode) را فعال کنید.
4. **Load unpacked** را بزنید و پوشه‌ای را انتخاب کنید که `manifest.json` در ریشهٔ آن است.
5. [Google Flow](https://flow.google.com) را باز کنید، آیکون افزونه را بزنید و ثبت را روشن کنید.

اگر فهرستی دیده نشد، صفحهٔ Flow را یک‌بار تازه کنید.

## توسعه

```bash
npm install
npm run build
```

`npm run build` فایل‌های TypeScript داخل `src/` را به `dist/` کامپایل می‌کند. پنجرهٔ افزونه مستقیماً `popup.js` را بارگذاری می‌کند و مرحلهٔ ساخت جداگانه ندارد.

## ساختار

```text
manifest.json    تعریف افزونه (Manifest V3)
popup.html       پنجرهٔ افزونه
popup.js         وضعیت، فهرست اخیر، هم‌گام‌سازی زبانه‌ها
src/content.ts   قلاب fetch در صفحه؛ پاسخ را بدون تغییر برمی‌گرداند
src/bridge.ts    دریافت رویداد از صفحه و ذخیرهٔ آن
dist/            خروجی کامپایل
icons/           آیکون‌ها
```

## حدود پروژه

این مخزن مستقل است و وابستگی یا تأیید Google را ندارد. برای عبور از ورود، اشتراک، یا محدودیت دسترسی ساخته نشده است. کاری که انجام می‌دهد ثبت محلی نشانی درخواست‌های پیکربندی است.

## FutureForge

- وب: [futureforge.ir](https://futureforge.ir)
- اینستاگرام: [instagram.com/futureforge.ir](https://instagram.com/futureforge.ir)
- تلگرام: [t.me/futureforge_ir](https://t.me/futureforge_ir)
