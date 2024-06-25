//1
const express = require ('express')
const exphbs = require ('express-handlebars')
const session = require ('express-session')
const FileStore = require ('session-file-store')(session)
const flash = require('express-flash')

const app = express() //inicialização do express

const conn = require ('./db/conn')
//1

//3
const Tought = require('./models/Tought')
const User = require('./models/User')
//3

//4 Import Routes
const toughtsRoutes = require('./routes/toughtsRoutes')
const authRoutes = require('./routes/authRoutes')

// Import Controller
const ToughtController = require('./controllers/ToughtController')
//4



//2
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars') 

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

app.use(
    session({
        name: "session",
        secret: "nosso_secret",
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function() {},
            path: require('path').join(require('os').tmpdir(), 'sessions'),
        }),
        cookie: {
            secure: false,
            maxAge: 360000,
            expires: new Date(Date.now() + 360000),
            httpOnly: true
        }
    }),
)

app.use(flash())

app.use(express.static('public'))

app.use((req, res, next) => {

    if(req.session.userid) {
        res.locals.session = req.session
    }

    next()
})

//4 Routes
app.use('/toughts', toughtsRoutes)
app.use('/', authRoutes)

app.get('/', ToughtController.showToughts)


//2
//1
conn
    //.sync({ force: true })
    .sync()
    .then(() => {
        app.listen(4000)
    })
    .catch((err) => console.log(err))
//1