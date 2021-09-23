const express = require('express')
const app = express()
const port = 3000
const index = require('./routes')
const session = require('express-session')

app.set('view engine', 'ejs')
app.use('/', express.urlencoded({extended:false}))
app.use(session({
    secret: 'Alam the Dragon',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        sameSite: true
    }  
}))

app.use('/', index)

app.listen(port, () => {
    console.log(`This app is listening on port ${port}`);
})