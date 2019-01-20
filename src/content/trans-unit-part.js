export default class TransUnitPart {
  constructor (textNode) {
    this._textNode = textNode
    this._originalText = textNode.data
    this._element = null
  }

  getTextNode () {
    return this._textNode
  }

  convertToElement () {
    this._element = this._createFontElement()
    this._textNode.parentNode.insertBefore(this._element, this._textNode)
    this._textNode.remove()
  }

  addText (text) {
    const textElement = this._createFontElement()
    const textNode = document.createTextNode('')
    textNode.data = text
    textElement.appendChild(textNode)
    this._element.appendChild(textElement)
  }

  restoreTextNode () {
    const textNode = document.createTextNode(this._originalText)
    this._element.parentNode.insertBefore(textNode, this._element)
    this._element.remove()
  }

  _createFontElement (color = null) {
    const element = document.createElement('font')
    let style = 'vertical-align:inherit'
    if (color != null) {
      style += '; color: ' + color
    }
    element.setAttribute('style', style)
    return element
  }

  getOriginalText () {
    return this._originalText
  }

  debug (color) {
    this._element = this._createFontElement(color)
    this._textNode.parentNode.insertBefore(this._element, this._textNode)
    this._textNode.remove()
    this.addText(this._originalText)
  }
}
