const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isAuthor ,validateCampground} = require('../middleware');
const campgrounds = require('../controllers/campgrounds');


router.get('/home',campgrounds.home)
router.get('/', catchAsync(campgrounds.indexPage));
router.get('/create',isLoggedIn, campgrounds.renderNewForm);
router.post('/',isLoggedIn, validateCampground, catchAsync(campgrounds.createNewCampground));
router.get('/:id', catchAsync(campgrounds.showCampground));
router.get('/:id/edit',isAuthor, isLoggedIn, catchAsync(campgrounds.renderUpdateForm));
router.put('/:id',isAuthor,validateCampground, catchAsync(campgrounds.updateCampgrounds));
router.delete('/:id', isAuthor,isLoggedIn, catchAsync());

module.exports = router;