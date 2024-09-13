const express = require ('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds.js');
const catchAsync = require('../utils/catchAsync');
const campground = require('../models/campground');
const{validateCampground,isAuthenticated,isAuthor} = require('../middleware.js');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});



router.route('/')
  .get(catchAsync(campgrounds.index))
  .post(isAuthenticated,upload.array('image'),validateCampground,catchAsync(campgrounds.makeCampground));

router.get('/new', isAuthenticated,campgrounds.new);

router.route('/:id')
.get(catchAsync(campgrounds.show))
.put(isAuthor,isAuthenticated,upload.array('image'),catchAsync(campgrounds.submitEdit ))
.delete(isAuthenticated,catchAsync(campgrounds.delete))

router.get('/:id/edit',isAuthor,isAuthenticated,catchAsync(campgrounds.edit))

 


 module.exports = router;
