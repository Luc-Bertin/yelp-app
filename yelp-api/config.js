const config = {
    environment: process.env.NODE_ENV || 'dev',
    server: {
      port: process.env.PORT || 8000
    },
    mongo: {
      url: process.env.MONGO_DB_URI || 'mongodb://localhost/yelp_dataset'
    }
  }
  
  module.exports = config
  