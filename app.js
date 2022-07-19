const express = require('express');
const { default: mongoose, mongo, models } = require('mongoose');
const app = express();
const path = require('path');
const methodOverrride = require('method-override');
const ejsMate = require('ejs-mate');
const { stat } = require('fs');
const { wrap } = require('module');
const ExpressError = require('./utils/ExpressError')
const campgroundRoutes = require('./routers/campground');
const reviewRoutes = require('./routers/reviews');
const session = require('express-session');


mongoose.connect('mongodb://localhost:27017/yelp-camp'); 

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", ()=>{
    console.log("Database connected");
});

 

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.engine('ejs', ejsMate);
app.use(express.urlencoded({extended: true}));
app.use(methodOverrride('_method'))
app.use(express.static('public'))

const msInWeek = 1000*60*60*24*7;
const sessionConfig = {
    secret: 'thisShouldBeABetterSecret',
    resave:false,
    saveUninitialized:true,
    cookie: {
        httpOnly:true,
        expires: Date.now() + msInWeek,
        maxAge: msInWeek
    }
};

app.use(session(sessionConfig));



app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);


app.all('*', (err, req, res, next) => {
    next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Oh no, Something went Wrong!';
    res.status(statusCode).render('error', { err });
    
})
app.listen(3000, ()=> {
    console.log("Listening on port 3000");
})
