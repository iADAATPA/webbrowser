import Supplier from "./supplier"
import Engine from "./engine"



class LanguageTree {
    constructor (engines) {
        this._tree = []
    }   
}

export default class User {
    constructor(apiKey, accessPoint) {
        this._apiKey = apiKey
        this._accessPoint = accessPoint
        this._engines = Array()
        this._authenticated = false
    }
    
    auth() {
        const user = this
        var promise = new Promise((resolve, reject) => {
            // URL
            const url = user._accessPoint + "/describesuppliers/" + user._apiKey  
            
            // Send Request
            fetch(url).then(response => {
                if(response.ok) {
                    response.json().then(json => {
                        if (json.success) {
                            // Add engine to user
                            const suppliers = json.data.suppliers
                            suppliers.forEach(s => {
                                const supplier = new Supplier(s.id, s.name )
                                const engines = s.engines
                                engines.forEach(e => {
                                    const engine = new Engine(supplier, e.name, e.domain, e.source, e.target)
                                    user._engines.push(engine)
                                })
                            })
                            
                            //Sort engines byLang
                            this._engines = this._engines.sort(function(e1, e2) {             
                                if (e1.srcLangName < e2.srcLangName) {
                                  return -1;
                                }
                                if (e1.srcLangName > e2.srcLangName) {
                                  return 1;
                                }                      
                                if (e1.tgtLangName < e2.tgtLangName) {
                                    return -1   
                                }
                                if (e1.tgtLangName > e2.tgtLangName) {
                                    return 1   
                                }
                            })

                            // EngineByLang
                            this._engineByLang = {}
                            this._engines.forEach( (e, i) => {
                                let key = e.srcLangName
                                if (!(key in this._engineByLang)) {
                                    this._engineByLang[key]=[]                               
                                } 
                                this._engineByLang[key].push({index:i, tgtLangName:e.tgtLangName})                             
                            })
                            
                            console.log(this._engineByLang)
                            // Update Authenticated
                            user.setAuthenticated(true)                           
                        }
                        resolve(user)
                    }).catch(err => {
                        reject(err)                      
                    })          
                } else {
                    if (response.status == 401) {
                        resolve(user)
                    } else {
                        const err = new Error("HTTP error " + response.status)                    
                        reject(err)
                    }           
                }
            }).catch(err => {
                reject(err)
            })
        })
        return promise
    }   
    getEngineByLang() {
        return this._engineByLang
    }
    isAuthenticated() {
        return this._authenticated
    }

    setAuthenticated(bool) {
        this._authenticated = bool
    }
}

