const Facade = require('../../lib/facade')
const businessSchema = require('./schema')

class BusinessFacade extends Facade {}

module.exports = new BusinessFacade('businesses', businessSchema)
