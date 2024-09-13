if(process.env.NODE_ENV !== "production"){
  require('dotenv').config();
}
const  express = require('express');
const path = require ('path');
const mongoose = require ('mongoose');
const mongoStore = require('connect-mongo')
const ejsMate = require('ejs-mate');
const session =require('express-session');
const flash = require('connect-flash');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
const userRoutes = require('./routes/users.js');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews.js');
const mongoSanitize = require ('express-mongo-sanitize');
const  helmet  = require('helmet');
const MongoStore = require('connect-mongo');

const dbUrl = 'mongodb://0.0.0.0:27017/yelp-camp';

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

 
  const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", () => {
    console.log("Database connected");
});


const app = express();

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(mongoSanitize({
  replaceWith: '_'
}))

app.use(express.urlencoded({ extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));




const sessionConfig ={
    store:MongoStore.create({mongoUrl:dbUrl}),
    secret: 'thisshouldbeasecret',
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now()+ 1000*60*24*7,
        maxAge: 1000*60*60*24*7,
        httpOnly:true
    }
};
    app.use(session(sessionConfig));
    app.use(flash());
    app.use(helmet({
      contentSecurityPolicy: false,
    }));

    const scriptSrcUrls = [
      "https://stackpath.bootstrapcdn.com/",
      "https://kit.fontawesome.com/",
      "https://cdnjs.cloudflare.com/",
      "https://cdn.jsdelivr.net",
      "https://cdn.maptiler.com/", // add this
  ];

  const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", 
];

const connectSrcUrls = [
  
  "https://api.maptiler.com/", 
];

const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dprxwjcoa/", 
                "https://images.stockcake.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

    

    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()));
    
    passport.serializeUser((user, done) => {
      done(null, user.id);
    });
    
    passport.deserializeUser(async (id, done) => {
      try {
        const user = await User.findById(id);
        done(null, user);
      } catch (err) {
        done(err);
      }
    });

    app.use((req, res, next) =>{
      res.locals.currentUser = req.user;
      res.locals.success=req.flash('success');
      res.locals.error = req.flash('error');
      next();

    })

     app.use('/',userRoutes)
     app.use('/campgrounds', campgroundRoutes);
     app.use('/campgrounds/:id/reviews',reviewRoutes);
     

app.get('/',(req,res) =>{

    res.render('home')
})

 app.all('*', (req, res, next) =>{
    next(new ExpressError('Page not Found',404))
 })

 app.use ((err,req,res, next) =>{
    const {statusCode = 500} =err;
    if(!err.message) err.message = 'Oh no , Something went wrong!'
     res.status(statusCode).render('errorHandler',{err});

 })
app.listen(3000, () =>{
    console.log('Serving on port 3000')
})


