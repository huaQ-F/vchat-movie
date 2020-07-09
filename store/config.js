//这模块存放配置，以及读取写入新token到txt里存放（配置尽量放数据库）
const fs=require('fs');
const path=require('path')
const {promisify}=require('util')
const read=promisify(fs.readFile)
const write=promisify(fs.writeFile)

module.exports=config={
    wechat:{
        appID:'xx',
        appsecret:'xx',
        token:'xx',
        getAccess(){
            return read(path.join(__dirname,'wechat_access.txt'))
        },
        saveAccess(data){
            data=JSON.stringify(data);
            return write(path.join(__dirname,'wechat_access.txt'),data)
        }
    }
};
