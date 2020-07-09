//所有网页、微信公众号请求都要先经过这，处理微信公众号的请求校验处理
const User=require('../model/schemas/userschema')
const api=require('../api/api')

function isWchat(ua){
    return ua.indexOf('MicroMessenger')>-1
}

module.exports={
    checkWchat: async (ctx,next) => {
        const ua=ctx.headers['user-agent']
        const code=ctx.request.query.code;

        if(!ctx.session.user&&ctx.method==='GET'&&ctx.href.indexOf('show-login')>-1) {
            if (!code&&isWchat(ua)) {
                const redirect_url = encodeURIComponent(ctx.href)
                const scope = 'snsapi_userinfo'
                const state = 'fromWchat'
                let url = api.wchat.getAuthorizeURL(redirect_url, scope, state)

                ctx.redirect(url)
            }
        }
        await next()

    },
    getWchatInfo:async (ctx,next) => {
        const {code,state}=ctx.request.query
        if(code&&state==='fromWchat'){
            let data=await api.wchat.getToken(code)
            let user=await User.findOne({openid:data.openid})
            if(!user){
                let userInfo=await api.wchat.getUserInfo(data.access_token,data.openid)
                    user=new User({
                    openid:userInfo.openid,
                    unionid:userInfo.unionid,
                    uname:userInfo.nickname,
                    head_img:userInfo.headimgurl,
                    gender:userInfo.sex===1?'男':'女',
                    province:userInfo.province,
                    city:userInfo.city,
                    country:userInfo.country,
                    email:userInfo.unionid||userInfo.openid+'@wx.com'
                })
                await user.save((err) => {
                    if(err)
                })
            }
            ctx.session.user={
                id:user._id,
                uname:user.uname,
                head_img:user.head_img
            };
            ctx.redirect('/')
        }
        await next()
    }
 }
