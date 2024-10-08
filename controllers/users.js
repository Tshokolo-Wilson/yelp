const User = require('../models/user');

module.exports.display =  (req, res) =>{
    res.render('users/register');
}

module.exports.register = async (req,res) =>{
    try {
  const {email,username, password } = req.body;
  const user = new User ({email,username});
  const registeredUser = await User.register(user,password);
  req.login(registeredUser,err =>{
    if(err) return next(err);
    req.flash('success','Welcome to yelp Camp!');
    res.redirect('/campgrounds');

  })

     }catch (e) {
       req.flash('error', e.message);
       res.redirect('/register');
     }

}
module.exports.login =(req,res) =>{
    res.render('users/login',{User});
};

module.exports.authenticate = (req,res) =>{

    req.flash('success','Welcome to campgrounds');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next)=> {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash('success','Goodbye!');
      res.redirect('/login');
    });
}


