import Translator from './translator'
export default class WebPageTranslator {
  constructor () {
    console.log('WebPageTranslator waiting for translation')
    this._translators = []
  }
  hello () {
    console.log('hello')
  }
  translate (srcLang, tgtLang, domain, apiKey, accessPoint, batchSize) {
    console.log('Creating new translator')
    const translator = new Translator(document.body, srcLang, tgtLang, domain, apiKey, accessPoint, batchSize)
    this._translators.push(translator)
  }
}
