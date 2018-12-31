const Router = require('express').Router
const router = new Router()

const user = require('./model/user/router')
const business = require('./model/business/router')

router.route('/').get((req, res) => {
  res.json([{ message: 'Welcome to yelp-api API!' }])
})

router.use('/user', user)
router.use('/business', business)

module.exports = router
