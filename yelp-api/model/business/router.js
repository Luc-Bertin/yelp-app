const controller = require('./controller')
const Router = require('express').Router
const router = new Router()



router.route('/')
  .get((...args) => controller.find(...args));

router.route('/aggregate')
  .get((...args) => controller.aggregate(...args));

router.route('/distinct')
  .get((...args) => {
    controller.distinct(...args)
  });

router.route('/mapReduce')
  .get((...args) => controller.mapReduce(...args));


router.route('/:id')
  .get((...args )=> controller.findById(...args));




  



module.exports = router
