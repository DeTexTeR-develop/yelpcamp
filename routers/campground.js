const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isAuthor ,validateCampground} = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const {storage} = require('../cloudinary')
const upload = multer({storage});

router.get('/home',campgrounds.home)
router.get('/create',isLoggedIn, campgrounds.renderNewForm);

router.route('/')
	.get(catchAsync(campgrounds.indexPage))
	// .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createNewCampground))

	// for uploading single file
	// .post(upload.single('image'), (req, res) => {

	//for multiple files
	.post(upload.array('image'), (req, res) => {
		console.log(req.body , req.files);
		res.send('it worked');
	})

router.route('/:id')
	.get(catchAsync(campgrounds.showCampground))
	.put(isAuthor,validateCampground, catchAsync(campgrounds.updateCampgrounds))
	.delete(isAuthor,isLoggedIn, catchAsync(campgrounds.deleteCampground))


router.get('/:id/edit',isAuthor, isLoggedIn, catchAsync(campgrounds.renderUpdateForm));

module.exports = router;