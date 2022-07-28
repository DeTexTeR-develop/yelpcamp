const express = require('express');
const passport = require('passport');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const user = require('../controllers/user');

router.route('/register')
    .get(user.registerUserForm)
    .post(catchAsync(user.registerUser));

router.route('/login')
    .get(user.loginPage)
    .post(
    passport.authenticate(
        'local',
        {
            failureFlash:true,
          failureRedirect:'/user/login'
        }),
    user.login
    );


router.get('/logout', user.logout);

module.exports = router;
