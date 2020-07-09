const Type=require('../model/schemas/typeschema')
const Movie=require('../model/schemas/movieschema')

let movietype={
    show:async (ctx) => {
        let data=await Type.find({})
        ctx.render('movietype',{data})

    },
    create:async (ctx) => {
        const {tagName}=ctx.request.body;
        let result=await Type.find({tagName})
        if(result.length===0){
            const movieType=new Type({tagName})
            movieType.save(err=>{
                if(err)throw(err);
            })
            ctx.body={code:'001',msg:'插入成功'}
        }else{
            ctx.body={code:'002',msg:'已有分类'}
        }

    },
    del:async (ctx) => {
        const {_id}=ctx.request.query;
        let resultList=await Type.findOne({_id})
        await Movie.remove({_id:{$in:resultList.movieList}})
        let result=await Type.remove({_id})
        if(result.ok===1){
            ctx.body={code:'001',msg:'删除成功'}
        }
    },
    update:async (ctx) => {
        const {_id,tagName}=ctx.request.body;
        let result=await Type.find({tagName})
        if(result.length===0){
            let result=await Type.update({_id},{$set:{tagName}})
            ctx.body={code:'001',msg:'ok'}
        }else{
            ctx.body={code:'002',msg:'已有分类'}
        }
    },
}

module.exports=movietype
