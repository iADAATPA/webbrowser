import {ISO_CODE_TO_LANGUAGE_NAME} from './language-name-by-code.js'

export default class Engine {
  constructor (supplier, name, domain, srcLang, tgtLang) {
    this.supplier = supplier
    this.name = name
    this.domain = domain
    this.domainShown = domain
    if (domain === '') {
      this.domainShown = 'Generic'
    }
    this.srcLang = srcLang
    if (srcLang.includes('-')) {
      const parts = srcLang.split('-')
      const lang = parts[0]
      const country = parts[1]
      this.srcLangName = ISO_CODE_TO_LANGUAGE_NAME[lang] + ' (' + country + ')'
    } else {
      this.srcLangName = ISO_CODE_TO_LANGUAGE_NAME[srcLang]
    }

    this.tgtLang = tgtLang
    if (tgtLang.includes('-')) {
      const parts = tgtLang.split('-')
      const lang = parts[0]
      const country = parts[1]
      this.tgtLangName = ISO_CODE_TO_LANGUAGE_NAME[lang] + ' (' + country + ')'
    } else {
      this.tgtLangName = ISO_CODE_TO_LANGUAGE_NAME[tgtLang]
    }
  }
}
