const sha1=require('sha1');
const request=require('request');
const prefix='https://api.weixin.qq.com/cgi-bin/';
let api={
    access_token:prefix+'token?grant_type=client_credential&',
};
var keep;

function Wechat(opts){
    var that = this
    this.appID = opts.appID;
    this.appsecret = opts.appsecret;
    this.readAcc=opts.getAccess;
    this.saveAccess=opts.saveAccess;
    this.getBody=function(postData){
        return new Promise((resolve, reject)=>{
            request(postData,function (err,response,body) {
                if(err){
                    reject(err)
                    return
                }
                resolve(body)
            })
        })
    };
    this.getAcc()
}
Wechat.prototype.getAcc= function() {
    var that=this
    if(keep&&this.isValidAccess(keep)){

        return Promise.resolve(keep)
    }
    return that.readAcc().then(data=>{
        try{
            data=JSON.parse(data)
        }catch(err){
            return that.updataAccess();
        }
        if (that.isValidAccess(data)){
            return Promise.resolve(data)
        }else{
            return that.updataAccess()
        }
    }).then(async (data)=>{
        if (!data){

            return;
        }
        keep=data

        that.saveAccess(data)
        return Promise.resolve(data)
    }).catch(err=>{
        throw err
    })
}

Wechat.prototype.isValidAccess=(data)=>{
    if (!data|| !data.access_token|| !data.expires_in){
        return false
    }
    let expires_in=data.expires_in;
    let now=new Date().getTime();
    return now < expires_in;
};
Wechat.prototype.updataAccess=function(){
    let appID=this.appID;
    let appsecret=this.appsecret;
    let url=`${api.access_token}appid=${appID}&secret=${appsecret}`;
    let getdata={};
    return new Promise((resolve, reject)=>{
        request.get(url,function (err,response,body) {

            let data=body
            getdata=JSON.parse(data);
            getdata.expires_in=new Date().getTime()+(getdata.expires_in-20)*1000;
            resolve(getdata)
        });
    })
};


exports.gJs=async (ctx,opts)=>{
    var we=new Wechat(opts)
    let token=opts.token;
    let signature=ctx.request.query.signature;
    let nonce=ctx.request.query.nonce;
    let timestamp=ctx.request.query.timestamp;
    let echostr=ctx.request.query.echostr;
    let str=[token,timestamp,nonce].sort().join('');
    let sha=sha1(str);
    if(ctx.request.method==='GET'){
        if (sha===signature) {
            ctx.body=echostr+'';

        }else{

        }
    }else if(ctx.request.method==='POST'){
        return sha === signature
    }
};
exports.Wechat=Wechat;

