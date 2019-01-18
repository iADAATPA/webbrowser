
import {TransUnit} from './trans-unit'
import TransUnitPart from './trans-unit-part'

export default class TransUnitParser {
    constructor(el=null){
        this._nonBreakingTags = new Set(['a', 'b', 'i', 'em', 'strong', 'big', 'small', 'abbr', 'acronym', 'dfn', 'time', 'q', 'span', 'sub', 'sup'])
        this._excludedTags = new Set(["script", "code", "var"])   
        
        // Default element is the document body
        if (el == null) {
            el = document.body
        }

        // Normalize DOM
        el.normalize() 
        
        // Create TransUnit array
        this._transUnits = [new TransUnit()]
        
        // Found TransUnits
        this._parse(el)
        
        // Remove last empty trans unit
        if (this._getLastTransUnit().isEmpty()) {
            this._transUnits.splice(-1)
        }  

        // Initialize transUnit
        this._transUnits.forEach(transUnit=>{
            transUnit.init()
        })
    }
    
    getTransUnits() {
        return this._transUnits
    }

    _parse(el) {
        const nodes = el.childNodes
        nodes.forEach(node => {
            if (node.nodeType == Node.TEXT_NODE && !this._isEmptyTextNode(node)) {
                let transUnitPart = new TransUnitPart(node)
                this._addTransUnitPart(transUnitPart)        
            } else if (node.nodeType == Node.ELEMENT_NODE) {
                let tag = node.tagName.toLowerCase() 
                if (!this._excludedTags.has(tag)) {
                    // handle non breaking element
                    if (this._nonBreakingTags.has(tag)) {
                        this._parse(node)
                    } else {
                        // And Breaking elements
                        this._parse(node)
                        this._addTransUnit()
                    } 
                }
            }   
        })
    }
    
    _addTransUnit() {       
        if (!this._getLastTransUnit().isEmpty()) {
            const transUnit = new TransUnit()
            this._transUnits.push(transUnit)
        }          
    }

    _addTransUnitPart(transUnitPart) {
        this._getLastTransUnit().addPart(transUnitPart)
    }

    _isEmptyTextNode(node) {
        return !(/[^\t\n\r ]/.test(node.textContent))
    }

    _getLastTransUnit() {
        return this._transUnits[this._transUnits.length-1]
    }
}
