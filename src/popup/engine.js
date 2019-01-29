import {ISO_CODE_TO_LANGUAGE_NAME} from './language-name-by-code.js'

export default class Engine {
  constructor (supplier, name, domain, srcLang, tgtLang, langTable) {
    this.supplier = supplier
    this.name = name
    this.domain = domain
    this.domainShown = domain
    if (domain === '') {
      this.domainShown = 'Generic'
    }
    this.srcLang = srcLang
    if (langTable.hasOwnProperty(srcLang)) {
      this.srcLangName = langTable[srcLang]
    } else {
      if (srcLang.includes('-')) {
        const parts = srcLang.split('-')
        const lang = parts[0]
        const country = parts[1]
        this.srcLangName = ISO_CODE_TO_LANGUAGE_NAME[lang] + ' (' + country + ')'
      } else {
        this.srcLangName = ISO_CODE_TO_LANGUAGE_NAME[srcLang]
      }
    }

    this.tgtLang = tgtLang
    if (langTable.hasOwnProperty(tgtLang)) {
      this.tgtLangName = langTable[tgtLang]
    } else {
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
}
