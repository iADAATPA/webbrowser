import {ISO_CODE_TO_LANGUAGE_NAME} from './language-name-by-code.js'

export default class Engine {
  constructor (supplier, name, domain, srcLang, tgtLang) {
    this.supplier = supplier
    this.name = name
    this.domain = domain
    this.srcLang = srcLang
    this.tgtLang = tgtLang
    this.srcLangName = ISO_CODE_TO_LANGUAGE_NAME[srcLang]
    this.tgtLangName = ISO_CODE_TO_LANGUAGE_NAME[tgtLang]
  }
}
