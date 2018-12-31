const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const bluebird = require('bluebird')
const helmet = require('helmet')
const morgan = require('morgan')

const config = require('./config')
const routes = require('./routes')

const app = express()

//CORS: IMPORTANT MIDDLEWARE DONT U DARE TOUCH IT
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); // * => allow all origins
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, X-Auth-Token, Accept'); // add remove headers according to your needs
  next()
})

mongoose.Promise = bluebird
mongoose.connect(config.mongo.url).then(() => {
  console.log('Connected to mongoDB')
}).catch(e => {
  console.log('Error while DB connecting');
  console.log(e);
});

app.use(helmet())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(bodyParser.raw({type: 'application/javascript'}))
app.use(morgan('tiny'))

app.use('/', routes)

app.listen(config.server.port, () => {
  console.log(`Magic happens on port ${config.server.port}`)
})

module.exports = app