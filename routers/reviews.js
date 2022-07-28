const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/catchAsync');
const review = require('../controllers/review');

const {isReviewAuthor, validateReview, isLoggedIn} = require('../middleware');

router.get('/:reviewId', review.getAtReviews);
router.post('/',validateReview, isLoggedIn, wrapAsync(review.addReviews));
router.delete('/:reviewId',isReviewAuthor, isLoggedIn, wrapAsync(review.deleteReviews));

module.exports = router;