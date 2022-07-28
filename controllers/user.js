const User = require('../models/user');

module.exports.registerUserForm = (req, res) => {
    res.render('Users/register');
};

module.exports.registerUser = async(req, res, next) => {
    try{
        const {  email , username , password } = req.body;
        const user = new User({email, username});
        const newUser =  await User.register(user, password);
        req.login(newUser, err => {
            if(err) return next(err);
            req.flash('success','Welcome to Yelpcamp');
            res.redirect('/campgrounds')
        });
        
    }
    catch(e){
        req.flash('error', e.message);
        res.redirect('/User/register')
    }
};

module.exports.loginPage = (req, res) => {
    res.render('Users/login');
};

module.exports.login = (req, res) => {
    req.flash('success', 'welcome back');
    const returnUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(returnUrl);
};

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Successfully logged out');
    res.redirect('/campgrounds');
};
