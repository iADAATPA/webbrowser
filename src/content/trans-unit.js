import createUUID from "./../utils/create-uuid"
import he from "he"


// Constant that define the attribute name for the id of root  elements
const ROOT_ID_ATTRIBUTE = 'data-container-id'

// TransUnit
class TransUnit {
      
    constructor() {
        this._parts = Array()
        this._root = null
    }

    addPart(part) {
        this._parts.push(part);
    }

    isEmpty() {
        return (this._parts.length == 0);
    }

    init() {
        this.setRoot()
        this.setSrc()
    }

    // Define root element
    setRoot() {      
        if (this._parts.length ==0)
            throw new Error("Trans unit has no part");

        if (this._parts.length == 1) {
            this._root = this._parts[0].getTextNode().parentNode
           
        } else {
            var nodes = []        
            this._parts.forEach(part=>{   
                nodes.push(part.getTextNode())
            })
            var node = nodes[0]
    
            rocking:
            while (node = node.parentNode) {
                var i = nodes.length;    
                while (i--) {
                    if (!node.contains(nodes[i])) {
                        continue rocking
                    }                   
                }
                this._root = node
                break
            } 
        } 
        if (!this._root.hasAttribute('data-container-id')) {
            this._root.setAttribute('data-container-id',  createUUID())
        }       
    }

    getRoot() {
        return this._root
    }

    // Define to to translate
    setSrc() {
        if (this._parts.length == 1) {
            this._src =  this._parts[0].getOriginalText();
        } else {
            this._src  = '';
            this._parts.forEach( (part, i) => {
                this._src += '<a i="' + i + '">'+ part.getOriginalText() + '</a>';
            }) 
        }
    }

    getSrc() {
        return this._src
    }

    setTgt(tgt) {
        // Convert text nodes to element
           this._parts.forEach(part => {
           part.convertToElement();
        })  
        if (this._parts.length == 1) {
            this._parts[0].addText(he.decode(tgt))   
        } else {
            // Create a dom element in order to parse tags in tgt
            const tgtHTML = document.createElement('template');
            tgtHTML.innerHTML = tgt;
            const tgtHTMLChildNodes = tgtHTML.content.childNodes;
            
            // Parse it
            var lastPartIndex = 0;
            tgtHTMLChildNodes.forEach( (node, i) => {
                if (node.nodeType == Node.TEXT_NODE) {
                    this._parts[lastPartIndex].addText(he.decode(node.textContent));
                } else {
                    var partIndex = parseInt(node.getAttribute("i"));
                    this._parts[partIndex].addText(he.decode(node.textContent));
                    lastPartIndex = partIndex;
                }   
            })           
        }  
    }

    debug(color) {
        this._parts.forEach(part => {
            part.debug(color)
        })
    }
}

export {ROOT_ID_ATTRIBUTE,TransUnit}


