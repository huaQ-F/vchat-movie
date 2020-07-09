const Type=require('../model/schemas/typeschema')
const Movie=require('../model/schemas/movieschema')
const Comment=require('../model/schemas/comment_schema')

module.exports=index={
    movieList:async (ctx) => {
        let results=await Type.find().populate({
            path:'movieList',
            select:'_id cover movie pv',
            options:{limit:8}
        })
        ctx.render('index',{results})
    },
    movieTagList:async (ctx) => {
        let {aid}=ctx.params
        let more=ctx.query.more||0;
        let pagLimit=ctx.query.pagLimit||8;

        let results=await Type.findOne({_id:aid}).populate({
            path:'movieList',
            select:'_id cover movie pv desc',
            options:{limit:pagLimit,skip:more*pagLimit}
        });
        if(more!==0)ctx.body=results;
        else ctx.render('mtag_list',{results})
    },
    movieDetails:async (ctx) => {
        let {aid}=ctx.params
        let result=await Movie.findOne({_id:aid}).populate('tag','tagName')
        await Movie.updateOne({_id:aid},{$inc:{pv:1}})
        let commentResult=await Comment.find({movie_id: aid}).populate('from_id','_id head_img uname')
            .populate('add_comment.from_id','_id head_img uname')
            .populate('add_comment.to_id','_id head_img uname')
        commentResult=commentResult.length>0?commentResult:[];
        ctx.render('details',{result,commentResult})
    },
    comment:async (ctx) => {
        let {from_id,movie_id,content,to_id,comment_id}=ctx.request.body
        if(to_id){
            await Comment.updateOne({_id:comment_id},{$push:{add_comment: {from_id,movie_id,content,to_id}}}).exec((err) => {
                if(err)throw err
            })
            ctx.body={code:'001',msg:'提交成功'}
        }else{
            let comment=new Comment({from_id,movie_id,content})
            await comment.save((err) => {
                if(err)
            })
            ctx.body={code:'001',msg:'提交成功'}
        }
    }
}