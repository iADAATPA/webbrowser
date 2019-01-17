import Supplier from "./supplier"
import Engine from "./engine"


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

    getSrcLangs() {
        let srcLangs = new Set();
        this._engines.forEach(e=>{
            srcLangs.add(e.srcLang)
        })
        return Array.from(srcLangs).sort();
    }

    getTgtLangs() {
        let langs = new Set();
        this._engines.forEach(e=>{
            langs.add(e.srcLang)
        })
        return Array.from(langs).sort();
    }

    isAuthenticated() {
        return this._authenticated
    }

    setAuthenticated(bool) {
        this._authenticated = bool
    }
}
