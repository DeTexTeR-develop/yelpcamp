const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground');
const {campgroundSchema} = require('../schemas')



const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
}


router.get('/home',(req, res) => {
    res.render('campgrounds/home')
})

router.get('/', catchAsync(async (req, res) => {
    const allcamprounds = await Campground.find({});
    res.render('campgrounds/index', {allcamprounds});
}));

router.get('/create', (req, res) => {
    res.render('campgrounds/create');
})

router.post('/',validateCampground, catchAsync(async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);  
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}));

router.get('/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    res.render('campgrounds/show', {campground});
}))

//update Campground

router.get('/:id/edit', catchAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', {campground});

}));

// we can catch error in async in 2 ways

// route.put('/campgrounds/:id', async (req, res, next) => {
//     try{
//         const { id } = req.params;
//         const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
//         res.redirect(`/campgrounds/${campground._id}`)
//     }
//     catch(err){
//         next(e);
//     }
// });

//   

router.put('/:id',validateCampground, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`)
}));

//delete campground

router.delete('/:id', catchAsync(async(req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

module.exports = router;