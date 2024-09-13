const express = require('express');
const router = express.Router();
const passport = require('passport');
const Strategy = require('passport-local');
const LocalStrategy = require('../passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const users = require('../controllers/users');
const {storeReturn} = require('../middleware');

router.get('/register',users.display);

router.post('/register', catchAsync(users.register ));


router.get('/login',users.login);
router.post('/login',storeReturn,passport.authenticate('local',{ failureFlash: true, failureRedirect: '/login'}),users.authenticate)

router.get('/logout', users.logout);

module.exports = router;
