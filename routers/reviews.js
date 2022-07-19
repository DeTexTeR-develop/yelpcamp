const express = require('express');




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
