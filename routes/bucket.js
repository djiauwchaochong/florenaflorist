const express = require('express')
const Controller = require('../controllers/controller')
const router = express.Router()

router.get('/', (req, res) => {
    Controller.getBucket(req, res)
})

router.get('/:id', (req, res) => {
    Controller.getBucketDetail(req, res)
})

router.get('/restock/:id', (req, res) => {
    Controller.restock(req, res)
})

router.get('/buy/:id', (req, res) => {
    Controller.buy(req, res)
})

module.exports = router