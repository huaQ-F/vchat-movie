const mongoose=require('mongoose')
const Schema = mongoose.Schema;
const ObjectId=Schema.Types.ObjectId;

let CommentSchema = new Schema({
    movie_id:{
        type:ObjectId,
        ref:'Movies'
    },
    from_id:{
        type:ObjectId,
        ref:'Users'
    },
    content:String,
    add_comment:[
        {
            from_id:{
                type:ObjectId,
                ref:'Users'
            },
            to_id:{
                type:ObjectId,
                ref:'Users'
            },
            content:String,
        }
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

CommentSchema.pre('save',function(next){
    if(this.isNew){
        this.meta.createAt=this.meta.upDateAt=Date.now()
    }else{
        this.meta.upDateAt=Date.now()
    }
    next()
})

let Comment = mongoose.model('Comments', CommentSchema);
module.exports=Comment
