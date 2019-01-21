# Web Translator

A chrome extension to translate web page threw the mt-hub platform

## User guide
1. Download the web-translator.zip and extract it somewhere
2. Open Chrome
3. Copy and paste chrome://extensions into the navigation bar in Chrome or use the menu button (the three vertical dots) at the top right corner of Chrome to access the More tools > Extensions option.
4. Ensure that the "Developer mode" checkbox in the top right-hand corner is checked. 
5. Click on the "Load unpacked extension" button and chose tthe directory you have extracted in step 1
6. Click on the new icon that has appeared in the Chrome toolbar.
7. Enter your api key and log in
8. Select domain, source language, target language and click the translate button

## For developers
```
git clone https://github.com/LaurentBie/web-translator
npm install 
```
For dev:
```
npm run dev
```
For Prod
```
npm run build
```

## More
This extension is based on https/www.npmjs.com/package/vue-webpack-chrome-extension-template



