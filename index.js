if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
};
const express = require('express');
const { default: mongoose } = require('mongoose');
const app = express();
const path = require('path');
const methodOverrride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const campgroundRoutes = require('./routers/campground');
const reviewRoutes = require('./routers/reviews');
const userRoutes = require('./routers/users');
const session = require('express-session');
const MongoDbStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanatize = require('express-mongo-sanitize');
const dbConnect = require('./config/dbConnect');
const dbUrl = process.env.DB;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.engine('ejs', ejsMate);
app.use(express.urlencoded({extended: true}));
app.use(methodOverrride('_method'));
app.use(express.static('public'));
app.use(mongoSanatize());
dbConnect();

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const msInWeek = 1000*60*60*24*7;
const secret = process.env.SECRET || 'thisisnotaverygoodsecret';


const store = new MongoDbStore({
    url:dbUrl,
    secret,
    touchAfter: 24*60*60
})

store.on('error' , function(e){
    console.log('session store error')
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave:false,
    saveUninitialized:true,
    cookie: {
        httpOnly:true,
        // secure :true, //cookies can only be changes/config through https
        expires: Date.now() + msInWeek,
        maxAge: msInWeek
    }
};


app.use(session(sessionConfig));
app.use(flash());

//passport.session() should always be after session
app.use(passport.initialize());
app.use(passport.session());



app.use((req, res , next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/user', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get('/', (req, res) => {
    res.render('campgrounds/home')
});


app.all('*', (err, req, res, next) => {
    next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Oh no, Something went Wrong!';
    res.status(statusCode).render('error', { err });
})

module.exports = app;