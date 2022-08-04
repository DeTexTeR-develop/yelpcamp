const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isAuthor ,validateCampground} = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const {storage} = require('../cloudinary')
const upload = multer({
	storage,
	limits: { fileSize: 6000000 }
	//filesize in bytes, in this case it's 500 kb 
}); 

router.get('/create',isLoggedIn, campgrounds.renderNewForm);

router.route('/')
	.get(catchAsync(campgrounds.indexPage))
	.post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createNewCampground))

router.route('/:id')
	.get(catchAsync(campgrounds.showCampground))
	.put(isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampgrounds))
	.delete(isAuthor,isLoggedIn, catchAsync(campgrounds.deleteCampground))


router.get('/:id/edit',isAuthor, isLoggedIn, catchAsync(campgrounds.renderUpdateForm));

module.exports = router;