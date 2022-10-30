const db=require('../confiq/connection')
const collections=require('../confiq/collections')
const bcrypt=require('bcrypt')
const { response, get } = require('../app')
const objectId =require('mongodb').ObjectId
module.exports={
    
                        // LOGIN

    doLogin:(adminData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus=false
            let response={}
            let admin=await db.get().collection(collections.ADMIN_COLLECTIONS).findOne({Email:adminData.Email})
            if(admin){
               
                bcrypt.compare(adminData.Password,admin.Password).then((status)=>{
                    if(status){
                        console.log("logedin");
                        response.admin=admin
                        response.status=true
                        resolve(response)
                    }else{
                        console.log("failed");
                        resolve({status:false})
                    }
                })
            }
            else{
                console.log("login failed");
                resolve({status:false})
            }
        })
    },

                                            // PRODUCT

    getAllProduct:(productId)=>{
        return new Promise(async(resolve,reject)=>{
            let products=await db.get().collection(collections.PRODUCT_COLECTIONS).find().toArray()
            resolve(products)
        })
    },

    prodoductDetails:(prodId)=>{
        return new Promise(async(resolve,reject)=>{
            db.get().collection(collections.PRODUCT_COLECTIONS).findOne({_id:objectId(prodId)}).then((response)=>{
                resolve(response)
            })
        })

    },
    
    addProduct:(product,callback)=>{
        db.get().collection('PRODUCT').insertOne(product).then((data)=>{
            let id=data.insertedId.toString()
            console.log(id);
            callback(id)
        })
    },
    
    updateProduct:(prodId,editproduct)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.PRODUCT_COLECTIONS).updateOne({_id:objectId(prodId)},{$set:{
                name:editproduct.name,
                category:editproduct.category,
                description:editproduct.description,
                price:editproduct.price,
                Realprice:editproduct.Realprice
            }}).then((response)=>{
                resolve(prodId)
            })
        }
        )
    },

    deleteproduct:(productId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.PRODUCT_COLECTIONS).remove({_id:objectId(productId)}).then((response)=>{
                resolve(true)
            })
        })
    },

    
                                  // USER MANAGEMENT 


    getAllUsers:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let users=await db.get().collection(collections.USER_COLLECTIONS).find().toArray()
            resolve(users)
         })  
    },

    deleteUser:(deleteid)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.USER_COLLECTIONS).remove({_id:objectId(deleteid)}).then((response)=>{
                resolve(true)
            })
        })
    },
    blockUser:(userData,user)=>{
        return new Promise((resolve,reject)=>{
            console.log("gggggg",userData);
            db.get().collection(collections.USER_COLLECTIONS).updateOne({_id:objectId(userData)},{
                $set:{
                    blocked:true
                }
            }).then((response)=>{
                resolve()
            })
        })
    },
    unblockUser:(userdata,user)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.USER_COLLECTIONS).updateOne({_id:objectId(userdata)},{
                $set:{
                    blocked:false
                }
            }).then((response)=>{
                resolve()
            })
        })
    }
    
    
}
        

    

    

