const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/catchAsync');
const Review = require('../models/review');
const Campground = require('../models/campground');
const {isReviewAuthor, validateReview, isLoggedIn} = require('../middleware');


router.get('/:reviewId' ,(req, res) => {
    res.redirect(`/campgrounds/${req.params.id}`);
})

router.post('/',validateReview, isLoggedIn, wrapAsync(async(req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'successfully added your review');
    res.redirect(`/campgrounds/${id}`); 
}));

router.delete('/:reviewId',isReviewAuthor, isLoggedIn, wrapAsync(async(req, res) => {
    const{ reviewId, id } = req.params; 
    await Campground.findByIdAndUpdate(id, {$pull:{reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Succefully deleted review');
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;