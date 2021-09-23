const express = require('express')
const Controller = require('../controllers/controller')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('bonk', {})
})

router.get('/userlist', (req, res) => {
    Controller.listUser(req, res)
})

router.get('/transaction', (req, res) => {
    Controller.transaction(req, res)
})

router.get('/transaction/:username/:id', (req, res) => {
    Controller.approve(req, res)
})

router.get('/bucketEdit', (req, res) => {
    Controller.bucketEdit(req, res)
})

router.get('/bucketEdit/add', (req, res) => {
    Controller.addBucketGet(req, res)
})

router.post('/bucketEdit/add', (req, res) => {
    Controller.addBucketPost(req, res)
})

router.get('/bucketEdit/delete/:id', (req, res) => {
    Controller.deleteBucket(req, res)
})

router.get('/bucketEdit/edit/:id', (req, res) => {
    Controller.editBucketGet(req, res)
})

router.post('/bucketEdit/edit/:id', (req, res) => {
    Controller.editBucketPost(req, res)
})

module.exports = router