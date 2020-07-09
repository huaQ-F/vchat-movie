const mongoose=require('mongoose')
mongoose.Promise=global.Promise
const path=require('path')
const glob=require('glob')
let connect={};
connect.connectEnv=()=>{
    return new Promise((resolve,reject)=>{
        if(process.env.NODE_ENV!=='production'){
            mongoose.set('debug',true)
        }
        const db=mongoose.connect('mongodb://localhost:8899/vchat_movies',{useNewUrlParser: true,useUnifiedTopology: true},function (err,client) {
            if(err)throw ('client fail')
            resolve(client)
        });
    })

}

module.exports=connect
