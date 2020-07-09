const Movie=require('../model/schemas/movieschema')
const request=require('request-promise')
const config=require('../store/config')
const appid=config.wechat.appID
const secret=config.wechat.appsecret
let api={
    callBackUrl:'https://open.weixin.qq.com/connect/oauth2/authorize?',
    access_token:'https://api.weixin.qq.com/sns/oauth2/access_token?',
    userInfo:'https://api.weixin.qq.com/sns/userinfo?'
}


exports.search={
    searchMovie:async (ctx) => {
        let {txt}=ctx.request.query
        let reg=new RegExp(".*"+txt+".*","i")
        let results=await Movie.find({movie:reg})
        ctx.body={code:'001',results:results}
    }

}
exports.wchat={
    getAuthorizeURL:(redirect_url,scope,state) => {
        let url=api.callBackUrl+`appid=${appid}&redirect_uri=${redirect_url}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`;
        return url
    },
    getToken: async (code) => {
        let url=api.access_token+`appid=${appid}&secret=${secret}&code=${code}&grant_type=authorization_code`;
        let data=await request(url)
        return JSON.parse(data)
    },
    getUserInfo:async (access_token,openid) => {
        let url=api.userInfo+`access_token=${access_token}&openid=${openid}`;
        let userInfo=await request(url)
        return JSON.parse(userInfo)
    }
}
