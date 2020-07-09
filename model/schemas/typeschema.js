const mongoose=require('mongoose')
const Schema = mongoose.Schema;
const ObjectId=Schema.Types.ObjectId;

let userSchema = new Schema({
    tagName:String,
    movieList:[
        {type:ObjectId,ref:'Movies'}
    ],
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

userSchema.pre('save',function(next){
    if(this.isNew){
        this.meta.createAt=this.meta.upDateAt=Date.now()
    }else{
        this.meta.upDateAt=Date.now()
    }
    next()
})

let Type = mongoose.model('Types', userSchema);
module.exports=Type
