const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {

  res.json('{ get all }')
});

router.get('/:id', (req, res, next) => {
  res.json('get one')
})

router.post('/', (req, res, next) => {
  res.json('post')
})

router.patch('/', (req, res, next) => {
  res.json('patch')
})

router.put('/', (req, res, next) => {
  res.json('put')
})

router.delete('/', (req, res, next) => {
  res.json('delete')
})



module.exports = router;
