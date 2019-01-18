export default class Director {
    constructor () {
        console.log("director started")
        this._translators = []
        document.body.addEventListener('translate', function (e) { 
        
        }, false);
    }    
    hello() {
        console.log("hello")
    }
}