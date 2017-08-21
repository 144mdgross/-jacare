const express = require('express');
const router = express.Router();
const knex = require('../knex')
const query = require('../modules/db_calls')

router.get('/', (req, res, next) => {
  query.artistIndex()
    .then(index => {
      res.json({ index })
    })

});

router.get('/:id', (req, res, next) => {

  query.artistAlbums(req.params.id)
    .then(data => {
      res.json({ data })
    })

})


module.exports = router;
