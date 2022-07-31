const Campground = require('../models/campground');
const {cloudinary} = require('../cloudinary');


module.exports.home = (req, res) => {
    res.render('campgrounds/home');
};

module.exports.indexPage = async (req, res) => {
    const allcamprounds = await Campground.find({}); 
    res.render('campgrounds/index', {allcamprounds});
};

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/create');
};

module.exports.createNewCampground = async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);
    const campground = new Campground(req.body.campground);
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    if(imgs.length > 4){
        req.flash('error', 'You can only upload upto 3 photos');
        return res.redirect(`/campgrounds/create`);
    }
    campground.images = imgs
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'successfully made a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
    const {id} = req.params;
    //this is known as nested populate you dont wanna do this just for username as its is more efficient just to
    //to store the username in the reviews.
    const campground = await Campground.findById(id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author');
    if(!campground){
        req.flash('error', 'Campground not found');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground});
};

module.exports.renderUpdateForm = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'Campground not found');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground});

};


// we can catch error in async in 2 ways

// route.put('/campgrounds/:id', async (req, res, next) => {
//     try{
//         const { id } = req.params;
//         const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
//         res.redirect(`/campgrounds/${campground._id}`)
//     }
//     catch(err){
//         next(e);
//     }
// });

//   or

module.exports.updateCampgrounds = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const img = req.files.map(f => ({url: f.path, filename: f.filename}));
    if(img.length > 4){
        req.flash('error', 'You can only upload upto 3 photos');
        return res.redirect(`/campgrounds/create`);
    }
    campground.images.push(...img); // pass img as seperate arguments to push
    await campground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull:{images:{filename: {$in: req.body.deleteImages}}}},{ new: true });
    }
    req.flash('success', 'Successfully updated campground');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async(req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Succefully deleted campground');
    res.redirect('/campgrounds');
};