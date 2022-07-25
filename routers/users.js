const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');


router.get('/register', (req, res) => {
    res.render('Users/register');
});
router.post('/register', catchAsync(async(req, res) => {
    try{
        const {  email , username , password } = req.body;
        const user = new User({email, username});
        const newUser =  await User.register(user, password);
        console.log(newUser);
        req.flash('success','Welcome to Yelpcamp');
        res.redirect('/campgrounds')
    }
    catch(e){
        req.flash('error', e.message);
        res.redirect('/User/register')
    }
}));

module.exports = router;
