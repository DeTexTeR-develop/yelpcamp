const Camgpround = require('./models/campground');
const {campgroundSchema,reviewSchema} = require('./schemas');
const ExpressError = require('./utils/ExpressError');

module.exports.isLoggedIn = (req , res, next) =>  {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must be signed in');
        return res.redirect('/user/login');
    }
    next();
}

module.exports.isAuthor = async(req, res, next) => {
    const {id} = req.params;
    const campground = await Camgpround.findById(id);

    if(req.user && !campground.author.equals(req.user._id)){
        req.flash('error', 'Dont have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const{error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}