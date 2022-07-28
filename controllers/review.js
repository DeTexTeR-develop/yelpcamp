const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.getAtReviews = (req, res) => {
    res.redirect(`/campgrounds/${req.params.id}`);
};

module.exports.addReviews = async(req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'successfully added your review');
    res.redirect(`/campgrounds/${id}`); 
};

module.exports.deleteReviews = async(req, res) => {
    const{ reviewId, id } = req.params; 
    await Campground.findByIdAndUpdate(id, {$pull:{reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Succefully deleted review');
    res.redirect(`/campgrounds/${id}`);
};
