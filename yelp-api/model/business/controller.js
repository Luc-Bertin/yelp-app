const Controller = require('../../lib/controller')
const businessFacade = require('./facade')

class BusinessController extends Controller {}

module.exports = new BusinessController(businessFacade)
