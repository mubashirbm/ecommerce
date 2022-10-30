const db = require('../confiq/connection')
const collections = require('../confiq/collections')
const bcrypt = require('bcrypt')
const { response } = require('../app')
const { USER_COLLECTIONS } = require('../confiq/collections')
module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            let emailexist = await db.get().collection(collections.USER_COLLECTIONS).findOne({ Email: userData.Email })
            if (!emailexist) {
                userData.Password = await bcrypt.hash(userData.Password, 10)
                db.get().collection(collections.USER_COLLECTIONS).insertOne(userData).then((data) => {
                    if (data) {
                        // data.emailexist = false
                        console.log(data, 'data');
                        resolve(data)
                        console.log("email not exist")
                    }
                })
            } else {
                console.log("emailexist");
                resolve( {emailexist: true} )
            }

        }
        )

    },
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let user = await db.get().collection(collections.USER_COLLECTIONS).findOne({ Email: userData.Email })
            if (user) {
                console.log(user, "user came");
              if(user.blocked){
                resolve({ status: false })
                console.log('blocked user');
              }else{
                bcrypt.compare(userData.Password, user.Password).then((status) => {
                    if (status) {
                        console.log("logedin");
                        response.user = user
                        response.status = true
                        resolve(response)
                    } else {
                        console.log("failed")
                        resolve({ status: false })
                    }
                })
            }
        }
        else{
            resolve({status:false})
        }
    })
    }
}
