const xml=require('xml')
let xmltemplate= (msgContent) => {
    let xmlStr=[
        {ToUserName:{_cdata:msgContent.FromUserName}},
        {FromUserName:{_cdata:msgContent.ToUserName}},
        {CreateTime:msgContent.timeNow}
    ];

    if (msgContent.msgType==='text'){
        xmlStr.push({MsgType:{_cdata:msgContent.msgType}})
        xmlStr.push({Content:{_cdata:msgContent.txt}})
    }else if(msgContent.msgType==='image'){
        let arr=[
            {MsgType:{_cdata:msgContent.msgType}},
            {Image:[{MediaId:{_cdata:msgContent.mediaId}}]}
        ]
        xmlStr.push(...arr)
    }else if(msgContent.msgType==='video'){
        let arr=[
            {MsgType:{_cdata:msgContent.msgType}},
            {Video:[
                {MediaId:{_cdata:msgContent.mediaId}},
                    {Title:{_cdata:msgContent.title}},
                    {Description:{_cdata:msgContent.description}}
            ]}
        ]
        xmlStr.push(...arr)
    }else if(msgContent.msgType==='music'){
        let arr=[
            {MsgType:{_cdata:msgContent.msgType}},
            {Music:[
                    {Title:{_cdata:msgContent.title}},
                    {Description:{_cdata:msgContent.description}},
                   {MusicUrl:{_cdata:msgContent.musicUrl}},
                   {HQMusicUrl:{_cdata:msgContent.hqMusicUrl}},
                   {ThumbMediaId:{_cdata:msgContent.mediaId}}
                ]}
        ]
        xmlStr.push(...arr)
    }else if(msgContent.msgType==='news'){
        let arr=[
            {MsgType:{_cdata:msgContent.msgType}},
            {ArticleCount:1},
            {Articles:[{item:[
                        {Title:{_cdata:msgContent.news.title}},
                        {Description:{_cdata:msgContent.news.description}},
                        {PicUrl:{_cdata:msgContent.news.picUrl}},
                        {Url:{_cdata:msgContent.news.url}}
                    ]}]}
        ]

        xmlStr.push(...arr)
    }else {}
    return xml({xml:xmlStr})
}
module.exports=xmltemplate
