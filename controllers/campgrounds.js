const { cloudinary } = require('../cloudinary');
const Campground = require('../models/campground');
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;


module.exports.index = async (req,res) =>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}

module. exports.new =  (req, res) =>{
    req.flash('sucess','Welcome to campground');
    res.render('campgrounds/new');
    
};

module.exports.makeCampground= async (req,res) =>{
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.features[0].geometry;
    campground.images =  req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.author = req.user._id;
   // console.log(campground);
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
     res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.show = async(req,res) =>{
    const campground = await Campground.findById(req.params.id).populate({
      path: 'reviews',
      populate: {
            path:'author'
      }
   
    }).populate('author');
    
    if(!campground){
       req.flash('error','Cannot find that campground!');
       return res.redirect('/campgrounds');
   } 
    res.render('campgrounds/show',{campground});
    
}

module.exports.edit = async (req,res) =>{
    const {id} = req.params;
    const campground =await Campground.findById(id);
    if(!campground){
       req.flash('error','Cannot find that campground!');
       return res.redirect('/campgrounds',{campground});
   } 
    res.render('campgrounds/edit',{campground});
   
}

module.exports.submitEdit = async (req,res) =>{
    
    const {id} = req.params;
    const  campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    campground.geometry = geoData.features[0].geometry;
    const imgs = req.files.map(f => ({url: f.path,filename: f.filename}));
    campground.images.push (...imgs);
    await campground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
          await  cloudinary.uploader.destroy(filename);
        }
    await campground.updateOne({$pull: {images: {filename:{$in:req.body.deleteImages}}}})
    }
    req.flash('success','Successfully updated campground!')
     res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.delete = async (req,res)=>{
   
    const {id} = req.params;
    const campground =await  Campground.findById(id);
    if(!campground.author.equals(req.user._id)) {
       req.flash('error','You do not have permission to do that');
       return res.redirect(`/campgrounds/${id}`);
    }
   
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}