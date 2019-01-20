import WebPageTranslator from './web-page-translator'
console.log('TEST2 Web page translator', window.webPageTranslator)
if (typeof (window.webPageTranslator) === 'undefined') {
  window.webPageTranslator = new WebPageTranslator()
}
