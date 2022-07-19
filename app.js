const { AsyncLocalStorage } = require('async_hooks');
const express = require('express');
const { default: mongoose, mongo, models } = require('mongoose');
const app = express();
const path = require('path');
const { findById, findByIdAndDelete } = require('./models/campground');
const {campgroundSchema, reviewSchema} = require('./schemas.js')
const Campground = require('./models/campground');
const methodOverrride = require('method-override');
const ejsMate = require('ejs-mate');
const { stat } = require('fs');
const { wrap } = require('module');
const ExpressError = require('./utils/ExpressError')
const wrapAsync = require('./utils/catchAsync');
const Review = require('./models/review');
const campgroundRoutes = require('./routers/campground');
const reviewRoutes = require('./routers/reviews');


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
