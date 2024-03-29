const express = require('express');
const app = express();
const path = require('path');
const ExpressError = require('./utils/ExpressError');
if (process.env.NODE_ENV !== "production") {
    const dotenv = require('dotenv');
    dotenv.config();
}

// ------------------------------------------------------------------------------------
// MONGOOSE SPECIFICS

const db_url = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
// const db_url = 'mongodb://localhost:27017/yelp-camp';
console.log("db_url: ", db_url);
const mongoose = require('mongoose');
mongoose.connect(db_url,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }).catch(err => {
        console.log(err);
    });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    // we're connected!
    console.log("DB connected");
});

// ------------------------------------------------------------------------------------
// ALL COMMON MIDDLEWARE FUNCTIONS
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Here app.use gets executed before any of the matching route callback functions,
// so basically here is the place we tell express to do something before going to the routes.
// although app.use can be used to handle req, res.
// All the app.use/get/put/post are middleware functions that are chained together in the order they are defined.
// so once the first middleware function call is done, the next middleware function in the sequence needs to be called for which the next() is used.
// Zeroth middleware
app.use(express.urlencoded({ extended: true }));
// first middleware
app.use(helmet());
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://code.jquery.com/jquery-3.6.0.js"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dhvmx2r1v/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
app.use(mongoSanitize());
// second middleware
app.use(methodOverride('_method'));
// third middleware
app.use(morgan('tiny'));
// My Middleware function
app.use((req, res, next) => {
    console.log("Request received with body: ", req.body);
    console.log("Request received with query: ", req.query);
    next();
    // not advised
    // console.log("After calling the middleware");
});

app.use(express.static(path.join(__dirname, "public")));

// ------------------------------------------------------------------------------------
// EXPRESS SESSION MIDDLEWARE
const secret = process.env.SECRET;
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const store = new MongoStore({
    url: db_url,
    secret: secret,
    touchAfter: 24 * 3600
})
store.on("error", function (err) {
    console.log("Session Store error: ", err);
})

const sessionConfig = {
    store: store,
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7), // For IE type browsers
        maxAge: (1000 * 60 * 60 * 24 * 7)
    }
}

app.use(session(sessionConfig));

// ------------------------------------------------------------------------------------
// PASSPORT MIDDLEWARE
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ------------------------------------------------------------------------------------
// FLASH MIDDLEWARE

const flash = require('connect-flash');

app.use(flash());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// ------------------------------------------------------------------------------------
// ALL ROUTE MIDDLEWARE FUNCTIONS

app.get('/', (req, res) => {
    res.render('homePage');
});

const { campgroundRouter, reviewRouter, usersRouter } = require('./routes');

app.use('/', usersRouter);
app.use('/campgrounds', campgroundRouter);
app.use('/campgrounds/:id/reviews', reviewRouter);


// ------------------------------------------------------------------------------------
// ERROR HANDLING MIDDLEWARE
app.use((req, res, next) => {
    // res.status(404).send('PAGE NOT FOUND');
    next(new ExpressError("PAGE NOT FOUND!!!", 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong', stack = '' } = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render('errorPage', { statusCode, message, stack });
});

// ------------------------------------------------------------------------------------
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log("Listening on port 8000 on localhost and 12000 broadcast");
});