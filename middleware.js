const Campground = require('./models/campground');
const {campgroundSchema,reviewSchema} = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Review = require('./models/review.js');

module.exports.validateCampground = (req,res,next) =>{
   
    const {error} = campgroundSchema.validate(req.body);
    if(error){
       const msg = error.details.map(el => el.message).join(',')
       throw new ExpressError(msg, 400)
    } else{
      next();
    }

}
 module.exports.isAuthenticated=(req, res, next) =>{
    console.log("REQ.USER...", req.user);
    if (req.isAuthenticated()) {
      return next();
    }
    req.session.returnTo =req.originalUrl;
    req.flash('error','You must be signed in');
   return res.redirect('/login');
  }

  module.exports.storeReturn =(req,res,next) =>{
    if(req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
      next();
  }

  
module.exports.isAuthor= async(req,res,next) =>{
    const {id} = req.params;
    const campground =await  Campground.findById(id);
     if(!campground.author.equals(req.user._id)) {
        req.flash('error','You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
     }
     next();

}

module.exports.validateReview = (req,res,next) =>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
     } else{
       next();
     }
    }

    module.exports.isReviewAuthor = async (req,res, next) =>{
        const {id,reviewId} = req.params;
        const review = await Review.findById(reviewId);
        if(!review.author.equals(req.user._id)){
            req.flash('error', 'You dont have permission');
            return res.redirect(`/campgrounds/${id}`)
        }
          next();

    }

    