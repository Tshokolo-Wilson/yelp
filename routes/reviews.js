const express = require ('express');
const router = express.Router({mergeParams:true});
const Campground = require('../models/campground');
const Review = require('../models/review');
const reviews = require('../controllers/reviews.js');
const catchAsync = require('../utils/catchAsync');
const {campgroundSchema} = require('../schemas.js');
const ExpressError = require('../utils/ExpressError');
const {reviewSchema} = require('../schemas.js');
const {validateReview,isAuthenticated,isReviewAuthor } = require('../middleware.js');



router.post('/',isAuthenticated, validateReview ,catchAsync(reviews.submit));

router.delete('/:reviewId',isReviewAuthor,isAuthenticated, catchAsync(reviews.delete));

module.exports = router;