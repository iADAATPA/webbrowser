import TransUnitContainer from './trans-unit-container'
import TransUnitParser from './trans-unit-parser'
import {ROOT_ID_ATTRIBUTE} from './trans-unit'
import TranslationBatch from './translation-batch'
import ElapsedTime from 'elapsed-time'

export default class Translator {
  constructor (element, srcLang, tgtLang, domain, apiKey, accessPoint, batchSize) {
    console.log('Translator: Created')
    // Some initializations
    this._element = element
    this._srcLang = srcLang
    this._tgtLang = tgtLang
    this._domain = domain
    this._apiKey = apiKey
    this._accessPoint = accessPoint
    this._batchSize = batchSize

    // Map of containers. a container is a DOM element that contain one or more transUnits
    this._containers = new Map()

    // Translation Batches
    this._batches = []

    // Extract transUnits
    const elapsedTime = ElapsedTime.new().start()
    const parser = new TransUnitParser(this._element)
    const transUnits = parser.getTransUnits()
    console.log('Translator:', transUnits.length, 'TransUnits Parsed in', elapsedTime.getValue())

    // Put transUnits in containers

    transUnits.forEach(transUnit => {
      let root = transUnit.getRoot()
      let id = root.getAttribute(ROOT_ID_ATTRIBUTE)
      let container
      if (!this._containers.has(id)) {
        container = new TransUnitContainer(root)
        this._containers.set(id, container)
      } else {
        container = this._containers.get(id)
      }
      container.addTransUnit(transUnit)
    })
    console.log('Translator: TransUnits associated with containers')

    // Define an observer for container and viewport intersection
    this._observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entrie => {
        if (entrie.isIntersecting) {
          observer.unobserve(entrie.target)
          // entrie.target.setAttribute('style','color:red')
          const id = entrie.target.getAttribute(ROOT_ID_ATTRIBUTE)
          const container = this._containers.get(id)
          container.getTransUnits().forEach(transUnit => {
            this._addTransUnitToBatch(transUnit)
          })
        }
      })
    }, {rootMargin: '0px 0px 500px 0px', threshold: 0})

    console.log('Translator: ViewPort and transUnits container intersection are observed ')

    // Add all containers to the observer
    this._containers.forEach(container => {
      const target = container.getElement()
      this._observer.observe(target)
    })

    // Timout
    let t = this
    this._timer = setInterval(function () { t._translate() }, 100)
  }

  _translate () {
    let batch
    while ((batch = this._batches.shift())) {
      batch.translate()
    }
  }

  _addTransUnitToBatch (transUnit) {
    if (!this._batches.length) {
      this._batches.push(new TranslationBatch(this, this._batchSize))
    }
    let batch = this._batches[this._batches.length - 1]
    if (batch.isFull()) {
      batch = new TranslationBatch(this, this._batchSize)
      this._batches.push(batch)
    }
    batch.addTransUnit(transUnit)
  }

  getSrcLang () {
    return this._srcLang
  }

  getTgtLang () {
    return this._tgtLang
  }

  getDomain () {
    return this._domain
  }

  getApiKey () {
    return this._apiKey
  }

  getAccessPoint () {
    return this._accessPoint
  }
}
