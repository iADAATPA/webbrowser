import Translator from './translator'
export default class WebPageTranslator {
  constructor () {
    console.log('WebPageTranslator waiting for translation')
    this._currentTranslator = null
  }
  translate (srcLang, tgtLang, domain, apiKey, accessPoint, batchSize) {
    if (this._currentTranslator !== null) {
      this._currentTranslator.stop()
    } 
    const translator = new Translator(document.body, srcLang, tgtLang, domain, apiKey, accessPoint, batchSize)
    this._currentTranslator = translator 

    return true
  }
}
