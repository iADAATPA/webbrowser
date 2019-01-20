import Supplier from './supplier'
import Engine from './engine'

export default class User {
  constructor (apiKey, accessPoint) {
    this._apiKey = apiKey
    this._accessPoint = accessPoint
    this._engines = []
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
              // Add engine to user
              const suppliers = json.data.suppliers
              suppliers.forEach(s => {
                const supplier = new Supplier(s.id, s.name)
                const engines = s.engines
                engines.forEach(e => {
                  let domain = e.domain
                  if (domain === '') {
                    domain = 'Generic'
                  }
                  const engine = new Engine(supplier, e.name, domain, e.source, e.target)
                  user._engines.push(engine)
                })
              })
              // for debug. REMOVE ME
              const engine = new Engine('xx', 'yyy', 'balabla', 'zh', 'en')
              user._engines.push(engine)

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
                if (e1.tgtLangName < e2.tgtLangName) {
                  return -1
                }
                if (e1.tgtLangName > e2.tgtLangName) {
                  return 1
                }
                return 1
              })

              // EngineByLang
              this._enginesByLang = {}
              this._engines.forEach((e, i) => {
                let key = e.srcLangName
                if (!(key in this._enginesByLang)) {
                  this._enginesByLang[key] = []
                }
                this._enginesByLang[key].push({
                  index: i,
                  srcLang: e.srcLang,
                  tgtLang: e.tgtLang,
                  tgtLangName: e.tgtLangName,
                  domain: e.domain
                })
              })

              // Engine Cascader
              this._engineCascader = []
              let currentDomain = null
              let currentSrcLang = null

              this._engines.forEach((e, i) => {
                if (currentDomain == null || e.domain !== currentDomain.value) {
                  currentDomain = {
                    label: e.domain,
                    value: e.domain,
                    children: []
                  }
                  this._engineCascader.push(currentDomain)
                  currentSrcLang = null
                }

                if (currentSrcLang == null || e.srcLang !== currentSrcLang.value) {
                  currentSrcLang = {
                    label: e.srcLangName,
                    value: e.srcLang,
                    children: []
                  }
                  currentDomain.children.push(currentSrcLang)
                }
                currentSrcLang.children.push({
                  label: e.tgtLangName,
                  value: e.tgtLang
                })
              })

              console.log('Engine casader', this._engineCascader)

              // console.log(this._enginesByLang)
              // Update Authenticated
              user.setAuthenticated(true)
            }
            resolve(user)
          }).catch(err => {
            console.log(err)
            resolve(user)
          })
        } else {
          if (response.status === 401) {
            resolve(user)
          } else {
            const err = new Error('HTTP error ' + response.status)
            console.log(err)
            resolve(user)
          }
        }
      }).catch(err => {
        console.log(err)
        resolve(user)
      })
    })
    return promise
  }
  getEnginesByLang () {
    return this._enginesByLang
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
