const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')

const app = express()

const conn = require('./db/conn')

const routes = require('./routes/routes')

app.engine('handlebars', exphbs())

app.set('view engine', 'handlebars')

// read bady
app.use( 
express.urlencoded({
    extended: true
}))

app.use(
    session({
        name: 'session',
        secret: 'nosso_secret',
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function(){},
            path: require('path').join(require('os').tmpdir(), 'sessions'),
        }),
        cookie: {
            secure: false,
            maxAge: 36000000000,
            expires: new Date(Date.now() + 36000000000),
            httpOnly: true
        }
    })
)

app.use(flash())

app.use((req, res, next) =>{
    if(req.session.userid)
    {
        res.locals.session = req.session
    }
    next()
})

app.use(express.json())

app.use(express.static('public') )

app.use('/', routes)

app.listen(3000)