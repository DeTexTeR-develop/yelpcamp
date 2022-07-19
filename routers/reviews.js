const express = require('express');
const router = express.Router({ mergeParams: true });
const {reviewSchema} = require('../schemas.js')

const wrapAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError')


const Review = require('../models/review');
const Campground = require('../models/campground');


const validateReview = (req, res, next) => {
    const{error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}


router.post('/',validateReview, wrapAsync(async(req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${id}`); 
}))

router.delete('/:reviewId', wrapAsync(async(req, res) => {
    const{ reviewId, id } = req.params; 
    await Campground.findByIdAndUpdate(id, {$pull:{reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;