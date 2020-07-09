const mongoose=require('mongoose')
const Schema = mongoose.Schema;
const bcrypt=require('bcryptjs')
const SALT_WORK_FACTOR=10;
const MAX_LOGIN_ATTEMPTS = 5
const LOCK_TIME=2*60*60*1000;

let userschema = new Schema({

    role:{   //用户角色（即设置权限，默认是用户非管理员）
        type:String,
        default:'user'
    },
    openid:[String],
    unionid:String,
    uname:{type:String,unique:true},
    head_img:String,
    address:String,
    province:String,
    country:String,
    city:String,
    gender:String,
    pwd:String,
    hash_pwd:String,
    email: {type:String,unique:true},
    LockUntil:Number,
    loginAttempts:{
        type:Number,
        required:true,
        default:0
    },
    meta:{
        createAt:{
            type:Date,
            default:Date.now()
        },
        upDateAt:{
            type: Date,
            default:Date.now()
        }
    }
});
userschema.virtual('isLocked').get(function () {
    return !!(this.lockUntil && this.lockUntil > Date.now())
})

userschema.pre('save',function(next){
    var that=this
    if(!this.isModified('pwd'))return next();
    if(this.isNew){
        this.meta.createAt=this.meta.upDateAt=Date.now()
    }else{
        this.meta.upDateAt=Date.now()
    }
    bcrypt.genSalt(SALT_WORK_FACTOR,(err,salt)=>{
        if(err)return next(err)
        bcrypt.hash(this.pwd,salt,(error,hash)=>{
            if(error)return next(error)
            that.pwd=hash
            next()
        })
    })
})
userschema.methods = {
    comparePassword: function (_password, pwd) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(_password, pwd, function (err, isMatch) {
                if (!err) resolve(isMatch)
                else reject(err)
            })
        })
    },
    incLoginAttempts: function (user) {
        const that = this

        return new Promise((resolve, reject) => {
            if (that.lockUntil && that.lockUntil < Date.now()) {
                that.update({
                    $set: {
                        loginAttempts: 1
                    },
                    $unset: {
                        lockUntil: 1
                    }
                }, function (err) {
                    if (!err) resolve(true)
                    else reject(err)
                })
            } else {
                let updates = {
                    $inc: {
                        loginAttempts: 1
                    }
                }
                if (that.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !that.isLocked) {
                    updates.$set = {
                        lockUntil: Date.now() + LOCK_TIME
                    }
                }
                that.update(updates, err => {
                    if (!err) resolve(true)
                    else reject(err)
                })
            }
        })
    }
}

let User = mongoose.model('Users', userschema);
module.exports=User
