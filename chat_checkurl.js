//这个文件是公众号第一次绑定域名时，临时开启的一个服务端，仅仅是为了绑定域名
const Koa=require('koa');
const sha1=require('sha1');
const config={
    wechat:{
        appID:'xx',
        appsecret:'xx',
        token:'xx'
    }
}
const chat_checkurl=new Koa();
chat_checkurl.listen(8080, () => {
    console.log('8080');
});
chat_checkurl.use(async (ctx)=>{
    console.log(ctx.query);
    const token=config.wechat.token;
    const signature=ctx.query.signature;
    const nonce=ctx.query.nonce;
    const timestamp=ctx.query.timestamp;
    const echostr=ctx.query.echostr;
    const str=[token,timestamp,nonce].sort().join('')
    const sha=sha1(str);
    if (sha===signature) {
        ctx.body=echostr+'';
        console.log('ok');
    }else{
        ctx.body='err'
    }
})
