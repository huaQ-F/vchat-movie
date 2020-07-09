const mongoose=require('mongoose')
const Schema = mongoose.Schema;
const ObjectId=Schema.Types.ObjectId;

let movieSchema = new Schema({
    movie:String,
    tag:{type:ObjectId,ref:'Types'},
    act:String,
    rating:Number,  //评级
    area:String,   //语种
    dir:String,  //导演
    desc:String,  //简介
    cover:String,  //封面
    year:Number,
    pv:{type:Number,default:0},
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

movieSchema.pre('save',function(next){
    if(this.isNew){
        this.meta.createAt=this.meta.upDateAt=Date.now()
    }else{
        this.meta.upDateAt=Date.now()
    }
    next()
})

let Movie = mongoose.model('Movies', movieSchema);
module.exports=Movie
