const express = require('express');
const passport = require('passport');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn} = require('../middleware');
const user = require('../controllers/user');

router.get('/register', user.registerUserForm);
router.post('/register' , catchAsync(user.registerUser));

router.get('/login', user.loginPage);

router.post(
    '/login',
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
