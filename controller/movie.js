const Movie=require('../model/schemas/movieschema')
const Type=require('../model/schemas/typeschema')
const path=require('path')
const request=require('request')
const fs=require('fs')

let movie={
    show:async (ctx) => {  //录入电影分类页面
        let data=await Movie.find({}).populate('tag','tagName')
        data=data||[];
        ctx.render('movie',{data})

    },
    add:async (ctx) => {
        let aid=ctx.params.aid
        if(aid==='0'){
            aid=''
        }
        let result=await Type.find({})
        if(result.length===0){
            result=[]
            ctx.render('addmovie',{result})
        }else{
            result.cover="//"+ctx.request.host+result.cover
            ctx.render('addmovie',{result,aid})
        }

    },
    saveMovie:async (ctx,next) => {
        let {aid}=ctx.request.body
        let {tag,act,rating,area,dir,desc,year}=ctx.request.body

        let body= {tag,act,rating,area,dir,desc,year}
        body.rating=body.rating-'';
        body.year=body.year-'';
        body.movie=ctx.request.body.apimovie||ctx.request.body.movie

        let result=await Movie.findOne({movie:body.movie})
        if (result&&!aid) {
            ctx.body = {code: '002', msg: '已有该名字电影'}
            return;
        };

        if (aid&&ctx.request.files.file.size===0) {
            body.cover = ctx.request.body.cover;
            result=await Movie.findOne({_id:aid})
            await delIdAndTid(aid,result.tag)
        }else if(ctx.request.files.file.size===0){
            let imgPath='/upload_cover/'+Date.now()+'.jpg'
            let coverPath=path.resolve('./public/'+imgPath)
            await (() => {
                return new Promise((resolve,reject) => {
                    request(ctx.request.body.cover).pipe(fs.createWriteStream(coverPath)).once('close', () => {

                        resolve()
                    })
                })
            })();
            body.cover =imgPath
        }else{
            body.cover = '/upload_cover/' + path.basename(ctx.request.files.file.path);
        }

        let movie = new Movie(body);
        await movie.save((err) => {
            if (err) throw err;
        });
        let typeResult = await Type.findOne({_id: tag});
        typeResult.movieList.push(movie._id);
        await typeResult.save(err => {
            if (err) throw(err);
        });
        ctx.redirect('/show-movie');
    },



    del:async (ctx) => {
        const {_id,tid}=ctx.request.query;
        await delIdAndTid(_id,tid)
        ctx.body={code:'001',msg:'success'}
    },
    showMovieUp:async (ctx) => {
        const {aid}=ctx.request.query;
        let result=await Movie.findOne({_id:aid})
        ctx.body={result}
    },

}
function delIdAndTid(_id,tid){
    return new Promise(async (resolve,reject) => {
        let result=await Movie.remove({_id})
        if(result.ok===1){
            let typeResult=await Type.findOne({_id:tid})
            let tagArr=typeResult.movieList

            let n=tagArr.indexOf(_id)
            tagArr.splice(n,1);

            await Type.update({_id:tid},{$set:{movieList:tagArr}})
            resolve()
        }

    })
}

module.exports=movie
