const Koa=require('koa');
const path=require('path')
const render=require('koa-art-template')
const static=require('koa-static')

let config=require('./store/config')
const {gJs,Wechat}=require('./controller/init_chat');
const sendContent=require('./store/send_msg')
let wechat=new Wechat(config.wechat)

const wchat=require('./controller/wechat')
const app=new Koa();
app.listen(8080);
console.log('8080')

render(app,{
    root:path.join(__dirname,'views'),
    extname:'.html',
    debug:process.env.NODE_ENV!=='production'
})

const koaBody = require('koa-body');
app.use(koaBody({
    multipart:true,
    formidable:{
        uploadDir:'./public/upload_cover',
        keepExtensions: true,
    }
}));

const session=require('koa-session')
app.keys=['session']
let store={
    storage:{},
    get(key){
        return this.storage[key]
    },
    set(key,session){
        this.storage[key]=session
    },
    destroy(key){
        delete this.storage[key]
    }
}
app.use(session({store:store},app))
app.use(async (ctx,next) => {
    ctx.state.user=ctx.session.user;
    await next()
})
app.use(async (ctx,next)=>{
    try{
        await next()
    }catch(err){
        ctx.render('error',{msg:'002',err})
    }
})

app.use(wchat.checkWchat)
app.use(wchat.getWchatInfo)
app.use(async (ctx,next) => {
    if(ctx.href.indexOf('dy')>-1){
        //预留微信JSSDK接口使用，以后扩展功能
        // let timestamp=parseInt(new Date().getTime()/1000,10)+''
        // let noncestr=Math.random().toString(36).substr(2,15)
        // let signature =await wechat.getTicket(noncestr,timestamp,ctx.href)
        // let wxConfig={
        //     appId: config.wechat.appID,
        //     timestamp:timestamp ,
        //     nonceStr: noncestr,
        //     signature: signature
        // };
        // await ctx.render("index",{wxConfig})
    }else{
        let bool=await gJs(ctx,config.wechat)
        if(bool){
            await console.log('ok')
            await sendContent(ctx,config.wechat)
        }
    }
    await next()
})


app.use(async (ctx,next)=>{
    if (ctx.url.startsWith('/public')) ctx.url=ctx.url.replace('/public','');
    await next()
})
app.use(static(path.resolve('./public')))
const connect=require('./model/connectdb')
app.use(async (ctx,next) => {
    await connect.connectEnv();
    await next()
})
const router=require('./routers/router')
app.use(router.routes())
app.use(router.allowedMethods())
