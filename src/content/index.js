import WebPageTranslator from './web-page-translator'
if (typeof (window.webPageTranslator) === 'undefined') {
  window.webPageTranslator = new WebPageTranslator()
}
