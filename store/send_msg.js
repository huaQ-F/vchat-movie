const getRawBody=require('raw-body');
const contentType=require('content-type');
const parseXml=require('./parsexml');
const templa=require('../views/template')

sendContent=async (ctx,opts) => {
    let contentConfig={
        subscribeMsg:'感谢关注公众号，本公司服务于媒体行业',
        phone:'13800138000',
        kefu:"<a href='https://www.baidu.com'>点击进入客服页面</a>",

    }

    let data=await getRawBody(ctx.req,{
        length:ctx.req.headers['content-length'],
        limit:'1mb',
        encoding:contentType.parse(ctx.req).parameters.charset
    })
    let getXmlContent=await parseXml.parseXMLAsync(data).then(async (content)=>{
        let msg=parseXml.formatMsg(content.xml);
        let XmlContent={}
        XmlContent.FromUserName=msg.FromUserName;
        XmlContent.ToUserName=msg.ToUserName;
        XmlContent.timeNow = parseInt(new Date().getTime() / 1000);
        switch (msg.MsgType) {
            case 'event':  //事件MsgType
                switch (msg.Event) {
                    case 'subscribe':
                        XmlContent.msgType = 'text';
                        XmlContent.txt = contentConfig.subscribeMsg
                        break;
                    case 'CLICK':  //点击事件+返回的推送消息，这里微信返回的是大写
                        switch (msg.EventKey) {
                            case 'sing':
                                XmlContent.msgType = 'text';
                                XmlContent.txt = 'click-sing'
                                break;
                        }
                        break;
                    case 'VIEW':  //跳转网页事件
                        switch (msg.EventKey) {
                            case 'http://www.soso.com/':

                                break;
                        }
                        break;
                    case 'scancode_push':  //扫码事件推送，有扫码事件推送（常用）和带提示扫码事件

                        break;
                }
                break;

            case 'text':   //文本MsgType

                switch (msg.Content) {
                    case '网站':
                        XmlContent.msgType = 'text';
                        XmlContent.txt = '<a href="http://v.400err.com/dy">点击进入</a>'
                        break;

                }
                break;
        }
        return XmlContent
    }).catch(err=>{throw err});
    ctx.status=200;
    ctx.set('Content-Type','application/xml');
    ctx.body=templa(getXmlContent)

}
module.exports=sendContent
