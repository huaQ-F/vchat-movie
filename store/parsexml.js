const xml2js=require('xml2js');

parseXml={
    parseXMLAsync(xml){
        return new Promise((resolve,reject)=>{
            xml2js.parseString(xml,{trim:true},(err,content)=>{
                if (err){
                    reject(err);
                    return
                }
                resolve(content)
            })
        })
    },
    formatMsg(result){
        let msg={};

        if (typeof result==='object') {
            let keys=Object.keys(result)
            for (var i = 0; i < keys.length; i++) {
                let item = result[keys[i]];
                let key=keys[i];

                if (item instanceof Array && item.length>1) {
                    msg[key]=[];
                    for (var j = 0; j < item.length; j++) {
                        msg[key].push(this.formatMsg(item[j]))

                    }
                } else if(item.length===1){
                    msg[key]=((typeof item[0]==='object')?this.formatMsg(item[0]):(item[0]||'').trim())
                }

            }
        }
        return msg

    }
};
module.exports=parseXml;
