import Supplier from './supplier'
import Engine from './engine'

export default class User {
  constructor (apiKey, accessPoint) {
    this._apiKey = apiKey
    this._accessPoint = accessPoint
    this._engines = []
    this._langTable = {}
    this._languagesLoaded = false
    this._authenticated = false
  }

  auth () {
    const user = this
    var promise = new Promise((resolve, reject) => {
      // URL
      const url = user._accessPoint + '/describesuppliers/' + user._apiKey

      // Send Request
      fetch(url).then(response => {
        if (response.ok) {
          response.json().then(json => {
            if (json.success) {
              this.getlanguageNames().then(() => {
                if (user._languagesLoaded !== false) {
                  // Add engine to user
                  const suppliers = json.data.suppliers
                  suppliers.forEach(s => {
                    const supplier = new Supplier(s.id, s.name)
                    const engines = s.engines
                    engines.forEach(e => {
                      let domain = e.domain
                      const engine = new Engine(supplier, e.name, domain, e.source, e.target, user._langTable)
                      user._engines.push(engine)
                    })
                  })

                  // Sort engines byLang
                  this._engines = this._engines.sort(function (e1, e2) {
                    if (e1.domain < e2.domain) {
                      return -1
                    }
                    if (e1.domain > e2.domain) {
                      return 1
                    }
                    if (e1.srcLangName < e2.srcLangName) {
                      return -1
                    }
                    if (e1.srcLangName > e2.srcLangName) {
                      return 1
                    }

                    if (e1.srcLang < e2.srcLang) {
                      return -1
                    }
                    if (e1.srcLang > e2.srcLang) {
                      return 1
                    }

                    if (e1.tgtLangName < e2.tgtLangName) {
                      return -1
                    }
                    if (e1.tgtLangName > e2.tgtLangName) {
                      return 1
                    }

                    if (e1.tgtLang < e2.tgtLang) {
                      return -1
                    }
                    if (e1.tgtLang > e2.tgtLang) {
                      return 1
                    }
                    return 1
                  })

                  // Engine Cascader
                  this._engineCascader = []
                  let currentDomain = null
                  let currentSrcLang = null

                  this._engines.forEach((e, i) => {
                    if (currentDomain === null || e.domain !== currentDomain.value) {
                      console.log('\n--\nnew domain', e.domain)
                      currentDomain = {
                        label: e.domainShown,
                        value: e.domain,
                        children: []
                      }
                      this._engineCascader.push(currentDomain)
                      currentSrcLang = null
                    }

                    if (currentSrcLang === null || e.srcLang !== currentSrcLang.value) {
                      console.log('\n--\nnew Src lang', e.srcLangName, e.srcLang)
                      currentSrcLang = {
                        label: e.srcLangName,
                        value: e.srcLang,
                        children: []
                      }
                      currentDomain.children.push(currentSrcLang)
                    }
                    console.log('new Tgt lang', e.tgtLangName, e.tgtLang)
                    currentSrcLang.children.push({
                      label: e.tgtLangName,
                      value: e.tgtLang
                    })
                  })

                  user.setAuthenticated(true)
                  resolve(true)
                }
              })
            } else {
              resolve(false)
            }
          }).catch(err => {
            console.log(err)
            resolve(false)
          })
        } else {
          if (response.status === 401) {
            resolve(false)
          } else {
            const err = new Error('HTTP error ' + response.status)
            console.log(err)
            resolve(false)
          }
        }
      }).catch(err => {
        console.log(err)
        resolve(false)
      })
    })
    return promise
  }

  getlanguageNames () {
    const user = this
    var promise = new Promise((resolve, reject) => {
      // URL
      const url = user._accessPoint + '/describelanguages/' + user._apiKey
      // Send request
      fetch(url).then(response => {
        if (response.ok) {
          response.json().then(json => {
            if (json.success) {
              user._languagesLoaded = true
              for (let language of json.data.languages) {
                user._langTable[language.code] = language.name
              }
            }
            resolve(true)
          }).catch(err => {
            console.log(err)
            resolve(false)
          })
        } else {
          if (response.status === 401) {
            resolve(false)
          } else {
            const err = new Error('HTTP error ' + response.status)
            console.log(err)
            resolve(false)
          }
        }
      }).catch(err => {
        console.log(err)
        resolve(false)
      })
    })
    return promise
  }
  getEngineCascader () {
    return this._engineCascader
  }

  isAuthenticated () {
    return this._authenticated
  }

  setAuthenticated (bool) {
    this._authenticated = bool
  }
}
