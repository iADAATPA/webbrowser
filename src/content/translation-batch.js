export default class TranslationBatch{
    constructor(translator, size){
        this._translator = translator
        this._size = size
        this._transUnits = []
    }

    addTransUnit(transUnit) {
        this._transUnits.push(transUnit)
    }

    isFull() {
        if (this._transUnits.length >= this._size)  
            return true  
        return false  
    }

    translate() {
        console.log("translate batch of " + this._transUnits.length + " translaton units")
         
        // Url
        const url = this._translator.getAccessPoint() + "/dev/translate"

        // Create request body
        let body = {
            source: this._translator.getSrcLang(),
            target: this._translator.getTgtLang(),
            token: this._translator.getApiKey(),
        }

        const domain = this._translator.getDomain()
        if (domain != null) {
            body['domain'] = domain
        }

        body['segments'] = []
        this._transUnits.forEach(transUnit => {
            body['segments'].push(transUnit.getSrc())
        })

        body = JSON.stringify(body)

        // Create request options
        const options = {               
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        }                

        // Send request
        const transaltionBatch = this

        fetch(url, options).then(response => {
            if(response.ok) {
                response.json().then(json => {
                    if (json.success) {
                        json.data.segments.forEach( (segment,i) => {
                            this._transUnits[i].setTgt(segment.translation)
                        })          
                    } else {
                        // TODO
                    }              
                }).catch(err => {
                                         
                })          
            } else {
               // TODO         
            }
        }).catch(err => {
            // TODO
        })
    }
}