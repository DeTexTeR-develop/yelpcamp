const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/catchAsync');
const review = require('../controllers/review');

const {isReviewAuthor, validateReview, isLoggedIn} = require('../middleware');

router.route('/:reviewId')
	.get(review.getAtReviews)
	.delete(isReviewAuthor, isLoggedIn, wrapAsync(review.deleteReviews))

router.post('/',validateReview, isLoggedIn, wrapAsync(review.addReviews));


module.exports = router;