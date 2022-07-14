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


const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
}

const validateReview = (req, res, next) => {
    const{error} = reviewSchema.validate(req.body);
    console.log(error);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}

app.get('/', (req, res) => {
    res.render('campgrounds/home')
})

app.get('/campgrounds', wrapAsync(async (req, res) => {
    const allcamprounds = await Campground.find({});
    res.render('campgrounds/index', {allcamprounds});
}));

app.get('/campgrounds/create', (req, res) => {
    res.render('campgrounds/create');
})

app.post('/campgrounds',validateCampground, wrapAsync(async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);  
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}));

app.get('/campgrounds/:id', wrapAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show', {campground});
}))

//update Campground

app.get('/campgrounds/:id/edit', wrapAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', {campground});

}));

// we can catch error in async in 2 ways

// app.put('/campgrounds/:id', async (req, res, next) => {
//     try{
//         const { id } = req.params;
//         const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
//         res.redirect(`/campgrounds/${campground._id}`)
//     }
//     catch(err){
//         next(e);
//     }
// });

//                                               or



app.put('/campgrounds/:id',validateCampground, wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`)
}));

//delete campground

app.delete('/campgrounds/:id', wrapAsync(async(req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

app.post('/campgrounds/:id/reviews',validateReview, wrapAsync(async(req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
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
