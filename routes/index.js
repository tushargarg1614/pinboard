var express = require('express');
var router = express.Router();
var userModel=require('./users');
var postModel=require('./post')
var passport=require('passport');
var localStrategy=require('passport-local');
var upload=require('./multer')
var flash=require('connect-flash')
passport.use(new localStrategy(userModel.authenticate()))

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{nav:false});
});
router.get('/username/:username',async function(req, res, next) {
  
  var regex= new RegExp(`^${req.params.username}`);
var users= await userModel.find({username:regex})
res.json(users)
});

router.post('/upload',isLoggedIn,upload.single('prof-img'),async function(req, res, next) {
  if(!req.file){
    return res.status(404).send('something went wrong or no file were given')
  }res.redirect('/profile');

  const user=  await userModel.findOne({username:req.session.passport.user})
 user.profileimage=req.file.filename
  await user.save()
  console.log(user.profileimage)
});
router.get('/edit',isLoggedIn, async function(req, res, next) {
  const user=  await userModel.findOne({username:req.session.passport.user})
  res.render('edit',{user,nav:true});
});

router.post('/updatedetails',isLoggedIn, async function(req, res, next) {
  var user=  await userModel.findOne({username:req.session.passport.user})
  user.fullname=req.body.fullname
  user.username=req.body.username
  user.description=req.body.description
  await user.save()
  res.redirect('/profile')
})

router.get('/showpins',isLoggedIn, async function(req, res, next) {
  const user=  await userModel.findOne({username:req.session.passport.user})
  .populate('posts')
  res.render('showPins',{user,nav:true});
  
});
router.get('/showSaved',isLoggedIn, async function(req, res, next) {
  const user=  await userModel.findOne({username:req.session.passport.user})
  .populate('saved')
  res.render('showSaved',{user,nav:true});
  
});

router.post('/createPin',isLoggedIn,upload.single('image'), async function(req, res, next) {
  if(!req.file){
    res.status(404).send('something went wrong')
  }
    const user=  await userModel.findOne({username:req.session.passport.user})
    const post= await postModel.create({
      image :req.file.filename,
      title: req.body.title,
      description:req.body.description,
      user:user._id
    })
    user.posts.push(post._id)
    await user.save()
  res.redirect('/profile')
});
router.post('/clickedUser',isLoggedIn, async function(req, res, next) {
  req.session.clickedUser= await userModel.findOne({username:req.body.username})
  .populate('posts')
 var loggedUser=await userModel.findOne({username:req.session.passport.user})
 .populate('posts')
 
 console.log("clicked user is "+req.session.clickedUser.username)
 console.log( "logged user is "+loggedUser.username)
 console.log(req.session.clickedUser.username===loggedUser.username)
 var clickedUser= req.session.clickedUser
 
 if(loggedUser.username===req.session.clickedUser.username){
   return res.json(loggedUser)
 }
 return res.redirect('/user')
 
});

router.get('/user',isLoggedIn, function(req, res, next) {
  var clickedUser=req.session.clickedUser
  res.render('user',{nav:true,clickedUser});
});
router.get('/userpins',isLoggedIn, function(req, res, next) {
  var clickedUser=req.session.clickedUser
  res.render('userPins',{nav:true,clickedUser});
});

router.get('/feed',isLoggedIn, async function(req, res, next) {
  const allPosts=await postModel.find().populate('user')
  
  res.render('feed',{allPosts,nav:true});
});

router.get('/profile',isLoggedIn, async function(req, res, next) {
  const user=  await userModel.findOne({username:req.session.passport.user})
  .populate('posts')
  res.render('profile',{user,nav:true});
});
router.get('/saved',isLoggedIn, async function(req, res, next) {
  const user=  await userModel.findOne({username:req.session.passport.user})
  .populate('saved')
  var clickedPost=req.session.clickedPost
  res.render('savedSection',{user,nav:true,clickedPost});
});

router.get('/createPin',isLoggedIn, async function(req, res, next) {
  const user=  await userModel.findOne({username:req.session.passport.user})

  res.render('createPin',{user,nav:true});
});
router.post('/savePin',isLoggedIn, async function(req, res, next) {
   req.session.clickedPost=  await postModel.findOne({image:req.body.image})
   
 var clickedPost=req.session.clickedPost
 const user=  await userModel.findOne({username:req.session.passport.user})
 
user.saved.push(clickedPost._id)
await user.save()
 res.redirect('/feed')
});


router.get('/login', function(req, res, next) {

  res.render('login',{nav:false,error:req.flash('error')});
});

router.post('/register',function(req, res, next) {
  var userData=new userModel({
    username:req.body.username,
    fullname:req.body.fullname,
    email:req.body.email
  });
  userModel.register(userData,req.body.password)
  .then(function(registereduser){
    passport.authenticate('local')(req,res,function(){
      res.redirect('profile')
    })
  })
});
router.post('/login',passport.authenticate('local',{
  successRedirect:'/profile',
  failureRedirect:'/login',
  failureFlash:true
  

}) ,function(req, res, next) { });

router.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next()
  }res.redirect('/login')
}

module.exports = router;
