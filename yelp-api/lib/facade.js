const mongoose = require('mongoose');

class Facade {
  constructor (name, schema) {
    this.Model = mongoose.model(name, schema);
  }

  create (body) {
    const model = new this.Model(body)
    return model.save()
  }

  find (condition, projection, options) {
    return this.Model
      .find(condition, projection, options)
      .exec()
  }

  findById (...args) {
    return this.Model
      .findById(...args)
      .exec()
  }

  aggregate(agg) {
    return this.Model
      .aggregate(agg)
      .exec()
  }

  distinct (key) {
    return this.Model
      .distinct(key)
      .exec()
  }

  mapReduce(map, reduce, callback){
    console.log(map.toString());
    console.log(reduce.toString());
    const o = {};
    o.map = map;
    o.reduce = reduce;
    o.query = {};
    o.out = {inline:1};
    this.Model.mapReduce(o, function(err, results){
      callback(err, results);
    });
  }
}

module.exports = Facade
