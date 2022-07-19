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
const campground = require('./models/campground');
const Review = require('./models/review');
const campgroundRoutes = require('./routers/campground')


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



const validateReview = (req, res, next) => {
    const{error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}

app.use('/campgrounds', campgroundRoutes);

app.post('/campgrounds/:id/reviews',validateReview, wrapAsync(async(req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${id}`); 
}))

app.delete('/campgrounds/:id/reviews/:reviewId', wrapAsync(async(req, res) => {
    const{ reviewId, id } = req.params; 
    await Campground.findByIdAndUpdate(id, {$pull:{reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/campgrounds/${id}`);
}))


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
