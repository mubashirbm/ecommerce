const db=require('../confiq/connection')
const collections=require('../confiq/collections')
const bcrypt=require('bcrypt')
const { response, get } = require('../app')
const objectId =require('mongodb').ObjectId

module.exports={
    addCategory:(category,callback)=>{
        db.get().collection(collections.CATEGORY_COLLECTIONS).insertOne(category).then((data)=>{
            let id=data.insertedId.toString()
            console.log(id);
            callback(id)
        })
    },
    getAllCategory:(productId)=>{
        return new Promise(async(resolve,reject)=>{
            let products=await db.get().collection(collections.CATEGORY_COLLECTIONS).find().toArray()
            resolve(products)
        })
    },

    categoryDetails:(prodId)=>{
        return new Promise(async(resolve,reject)=>{
            db.get().collection(collections.CATEGORY_COLLECTIONS).findOne({_id:objectId(prodId)}).then((response)=>{
                resolve(response)
            })
        })

    },
        
    updateCategory:(prodId,editproduct)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.CATEGORY_COLLECTIONS).updateOne({_id:objectId(prodId)},{$set:{
                name:editproduct.name,
                category:editproduct.category,
                description:editproduct.description,
                price:editproduct.price
            }}).then((response)=>{
                resolve(prodId)
            })
        }
        )
    },

    deleteCategory:(productId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.CATEGORY_COLLECTIONS).remove({_id:objectId(productId)}).then((response)=>{
                resolve(true)
            })
        })
    },
    
}