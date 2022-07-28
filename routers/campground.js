const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isAuthor ,validateCampground} = require('../middleware');
const campgrounds = require('../controllers/campgrounds');


router.route('/')
	.get(catchAsync(campgrounds.indexPage))
	.post(isLoggedIn, validateCampground, catchAsync(campgrounds.createNewCampground))

router.route('/:id')
	.get(catchAsync(campgrounds.showCampground))
	.put(isAuthor,validateCampground, catchAsync(campgrounds.updateCampgrounds))
	.delete(isAuthor,isLoggedIn, catchAsync())

router.get('/home',campgrounds.home)
router.get('/create',isLoggedIn, campgrounds.renderNewForm);
router.get('/:id/edit',isAuthor, isLoggedIn, catchAsync(campgrounds.renderUpdateForm));

module.exports = router;