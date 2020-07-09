const Router=require('koa-router')
const router=new Router();
const user=require('../controller/user')
const movietype=require('../controller/movietype')
const movie=require('../controller/movie')
const index=require('../controller/index-movie')
const api=require('../api/api')
router
    .get('*', async(ctx,next) => {
        if(!ctx.session.user
            &&ctx.request.url!=='/show-login'
            &&ctx.request.url!=='/show-signup'
            &&ctx.request.url!=='/signup'
            &&ctx.request.url!=='/'
            &&ctx.href.indexOf('/movie-tag-list')<0
            &&ctx.href.indexOf('/movie-details')<0
        )
            ctx.redirect('/show-login');
        await next();
    })
    ////首页和详情
    .get('/dy',index.movieList)
    .get('/',index.movieList)
    .get('/movie-tag-list/:aid',index.movieTagList)
    .get('/movie-details/:aid',index.movieDetails)
    .post('/comment-msg',index.comment)
    ////搜索api
    .get('/search',api.search.searchMovie)
    ////用户管理
    .get('/show-login',user.showLogin)
    .post('/login',user.login)
    .get('/admin-login',user.adminLogin)
    .get('/show-signup',user.showSignup)
    .get('/get-user',user.getUser)
    .post('/signup',user.signup)
    .get('/login-out',user.loginOut)
    ////电影分类管理
    .get('/show-movietype',movietype.show)
    .post('/create-movietype',movietype.create)
    .post('/update-movietype',movietype.update)
    .get('/del-movietype',movietype.del)
    ////电影管理
    .get('/show-movie',movie.show)
    .get('/add-movie/:aid',movie.add)
    .post('/savemovie',movie.saveMovie)

    .get('/del-movie',movie.del)
    .get('/show-movieup',movie.showMovieUp)


module.exports=router;
