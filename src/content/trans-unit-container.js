export default class TransUnitContainer {
  constructor (el) {
    this._transUnits = []
    this._element = el
  }

  addTransUnit (transUnit) {
    this._transUnits.push(transUnit)
  }

  getElement () {
    return this._element
  }

  getTransUnits () {
    return this._transUnits
  }
}
