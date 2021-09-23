const express = require('express')
const Controller = require('../controllers/controller.js')
const router = express.Router()
const admin = require('./admin.js')
const bucket = require('./bucket.js')

router.get('/', (req, res) => {
    res.render('landing', {error: req.query.error})
})

router.get('/login', (req, res) => {

    var msgError
    if(req.query.error){
        msgError = 'Invalid username / password'
    }

    res.render('login', {msgError: msgError})
})

router.post('/login', (req, res) => {
    Controller.login(req, res)
})

router.get('/register', (req, res) => {
    res.render('register', {})
})

router.post('/register', (req, res) => {
    Controller.createNewUser(req, res)
})

router.get('/logout', (req, res) => {
    Controller.logout(req, res)
})

// PENJEGALAN DIMULAI BUNG
router.use((req, res, next) => {
    if(req.session.userID){
        next()
    }
    else{
        res.redirect('/?error=noUserID')
    }
})

router.use('/admin', admin)
router.use('/bucket', bucket)

module.exports = router