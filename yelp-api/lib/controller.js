class Controller {
    constructor (facade) {
      this.facade = facade
    }
  
    create (req, res, next) {
      this.facade.create(req.body)
        .then(doc => res.status(201).json(doc))
        .catch(err => next(err))
    }
  
    find (req, res, next) {
      var condition = req.body.condition;
      var projection = req.body.projection;
      var options = req.body.options;
      return this.facade.find(condition, projection, options)
        .then(doc => res.status(200).json(doc))
        .catch(err => next(err))
    }
  
    findById (req, res, next) {
      return this.facade.findById(req.params.id)
        .then((doc) => {
          if (!doc) { return res.sendStatus(404) }
          return res.status(200).json(doc)
        })
        .catch(err => next(err))
    }
  
    aggregate (req, res, next) {
      return this.facade.aggregate(req.body.agg)
        .then(doc => res.status(200).json(doc))
        .catch(err => next(err))
    }
  
  
    distinct (req, res, next) {
      return this.facade.distinct(req.query.key)
        .then(function(doc){
          res.status(200).json(doc)
        })
        .catch(err => {
          next(err)
        })
    }

    mapReduce (req, res, next) {
      console.log(req.body.map.toString());
      console.log(req.body.reduce.toString());

      return this.facade.mapReduce(req.body.map, req.body.reduce, function(err, results){
        if(err)
          res.status(404).json(err);
        else
          res.status(200).json(results);
      })
    }
  }
  
  module.exports = Controller