const express = require('express');
const { response } = require('../app');
const router = express.Router();
const userhelpers=require('../Helpers/userHelpers')
const adminHelpers=require('../Helpers/adminHelpers');
const otphelpers=require('../Helpers/otphelper')
const { blockUser } = require('../Helpers/adminHelpers');

/* GET home page. */
router.get('/',(req, res, next)=> {
 
  let user=req.session.user
  
  console.log(user)
console.log("1");
if(user){
  adminHelpers.getAllProduct().then((products)=>{
    res.render('user/home',{user,products})
  })
 
}else{
  res.redirect('/login')
}
});

      // signup


router.get('/signup',(req,res)=>{
  // console.log(req.body)
  console.log("2");
  
  res.render('user/signup',{'signupErr':req.session.signupErr})
  req.session.signupErr=false
  
})

router.post('/signup',(req,res)=>{
 userhelpers.doSignup(req.body).then( (response)=>{
  console.log("response");
  console.log(response)
  if(response.emailexist){
    req.session.signupErr=true
  res.redirect('/signup')
  
  }else{
    console.log("redirect to sign up");
    res.redirect('/login')
    
  } 
 })
})


    // LOGIN

router.get('/login',(req,res)=>{
  console.log("4");
  if(req.session.loggedIn){
    res.redirect('/')
  }else{
    res.render('user/login',{'logErr':req.session.logErr,layout:'userlog'})
    req.session.logErr=false
  }
})

router.post('/login',(req,res)=>{
  userhelpers.doLogin(req.body).then((response)=>{
    console.log(console)
    if(response.status){
      req.session.loggedIn=true
      req.session.user=response.user
      console.log("5");
      res.redirect('/')
    }else{
      req.session.logErr=true
      console.log("6");
      res.redirect('/login')
    }
  })
})


        // OTP

router.get('/otp',(req,res)=>{
  res.render('user/otp',{'signupErr':req.session.signupErr,layout:'userlog'})
  req.session.signupErr=false
})





        // Home

router.get('/home',(req,res)=>{
  console.log("7");
  res.redirect('/')
})

      // CART

router.get('/cart',(req,res)=>{
  if(req.session.user){
    res.render('user/cart',{user:req.session.user})
  }else{
    res.redirect('/')
  }
})

      // CATEGORY

router.get('/category',(req,res)=>{ 
  if(req.session.user){
    adminHelpers.getAllProduct().then((products)=>{
      res.render('user/category',{user:req.session.user,products})
    })
   
  }else{
    res.redirect('/')
  }
})



router.get('/product_details/:id',(req,res)=>{
  adminHelpers.prodoductDetails(req.params.id).then((product)=>{
    console.log(product);
    if(req.session.user){
      res.render('user/product_details',{product,user:req.session.user})
    }else{
      res.redirect('/')
    }
  })
 
})
router.get('/checkout',(req,res)=>{
  if(req.session.user){
    res.render('user/checkout',{user:req.session.user})
  }else{
    res.redirect('/')
  }
})
router.get('/wishlist',(req,res)=>{
  if(req.session.user){
    res.render('user/wishlist',{user:req.session.user})
  }else{
    res.redirect('/')
  }
})

router.get('/user-profile',(req,res)=>{
  if(req.session.user){
    res.render('user/user-profile',{user:req.session.user})
  }else{
    res.redirect('/')
  }
})



    // LOGOUT
    
router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})

module.exports = router;
