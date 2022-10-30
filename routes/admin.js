const { ObjectID } = require('bson');
const { query } = require('express');
const express = require('express');
const { Db } = require('mongodb');
const { response } = require('../app');
const router = express.Router();
const adminhelpers = require('../Helpers/adminHelpers')
const categoryHelpers=require('../Helpers/categoryhelpers')
/* GET admin listing. */


router.get('/',(req,res)=>{
  let admin=req.session.admin
  console.log(admin)
  if(admin){
    console.log('00')
    res.render('admin/index',{layout:"adminLayout"})
  }else{
    console.log('11')
    res.redirect('admin/login')
  }
})
router.get('/login',(req,res)=>{
  console.log('22')
  res.render('admin/admin-login',{layout:'adminlog'})
})
// router.post('/login',(req,res)=>{
//   res.render('admin/admin-login',{layout:'adminlog'})
// })

router.post('/login',(req,res)=>{
  adminhelpers.doLogin(req.body).then((response)=>{
    console.log(console)
    if(response.status){
      req.session.loggedIn=true
      req.session.admin=response.admin
      console.log('33')
      res.redirect('/admin')
    }else{
      req.session.logErr=true
      console.log('44')
      res.redirect('login')
    } 
  })
})


router.get('/signup',(req,res)=>{
  
  res.render('admin/admin-sign-up',{layout:'adminlog'})
})

router.post('/signup',(req,res)=>{
  console.log(req.body)
  adminhelpers.doSignup(req.body).then( (response)=>{
  console.log(response)
  res.redirect('/adminlogin')
  })
 })
 
            // PRODUCT PAGE

 router.get('/add-product',(req,res)=>{
  console.log('7777')
  res.render('admin/add-product',{layout:'adminLayout'})
 })


router.post('/add-product',(req,res)=>{
  console.log(req.files);
  adminhelpers.addProduct(req.body,(id)=>{
    // console.log('id')
    let image=req.files.image
    console.log(id)
    image.mv('./public/product-image/'+id+'.jpg',(err,done)=>{
      if(!err){
        res.redirect('/admin/add-product')
      }else{
        console.log(err)
      }
    })
  })
})


router.get('/view-products',(req,res)=>{
  adminhelpers.getAllProduct().then((products)=>{
    console.log(products)
    res.render('admin/view-products',{products,layout:'adminLayout'})

  })
 })
 

 router.get('/edit-product/:id',async(req,res)=>{
  let products=await adminhelpers.prodoductDetails(req.params.id) 
  console.log(products);
  res.render('admin/edit-product',{products,layout:'adminLayout'})
 })

 router.post('/edit-product/:id',(req,res)=>{
  console.log(req.params.id);
  adminhelpers.updateProduct(req.params.id,req.body).then(()=>{
    console.log('edited prodiucts')
    let id=req.params.id
    if(req?.files?.image){
      let image=req.files.image
      image.mv('./public/product-image/'+id+'.jpg')
    }
    res.redirect('/admin/view-products')
    
  })
 })

router.get('/delete-product/:id',(req,res)=>{
  let productId=(req.params.id)
  adminhelpers.deleteproduct(productId).then((response)=>{
    res.redirect('/admin/view-products')
    
  })
})


 router.get('/adminlogout',(req,res)=>{
  console.log('lllllllllllll')
  req.session.destroy()
  res.redirect('/admin')
})

            // USER MANAGEMENT

router.get('/view-user',(req,res)=>{
  adminhelpers.getAllUsers().then((users)=>{
    // console.log(users)
    res.render('admin/view-user',{users,layout:'adminLayout'})
  })
       
})
router.get('/block-user/:id',(req,res)=>{
  adminhelpers.blockUser(req.params.id,req.body).then(()=>{

    res.redirect('/admin/view-user')
  })
})

router.get('/unblock-user/:id',(req,res)=>{
  adminhelpers.unblockUser(req.params.id,req.body).then(()=>{
    console.log("fdhsfgdhsfsdf");

    res.redirect('/admin/view-user')
  })
})





//                                   // CATEGORY

// router.get('/view-category',(req,res)=>{
//   console.log(req.body);
//   categoryHelpers.getAllCategory().then((category)=>{
//     console.log(req.body);
//     res.render('admin/view-category',{category,layout:'adminLayout'})
// })
//   })

//   router.post('/add-category',(req,res)=>{
//     categoryHelpers.addCategory((req.body)=>{
//       res.redirect('/admin/view-category')
//     })
//   })


        


module.exports = router;
 