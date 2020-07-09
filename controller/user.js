let User=require('../model/schemas/userschema')
const path=require('path')

let user={
    showLogin:async (ctx) => {
        ctx.render('login')
    },
    login:async (ctx,next) => {
        const {uname,pwd}=ctx.request.body
        let user=await User.find({uname});

        if(user.length===0){
            ctx.body={code:'002',msg:'账号或密码错误'}
        }else{
            user=user[0]
            const isMatch=await user.comparePassword(pwd,user.pwd)

            if(!isMatch){
                ctx.body={code:'002',msg:'账号或密码错误'};
                return
            }
            ctx.session.user={id:user._id,uname:user.uname,role:user.role,head_img:user.head_img}
            if(user.role==='admin')ctx.redirect('/admin-login');
            else ctx.redirect('/')
        }

    },
    adminLogin:async (ctx) => {
        const {id,uname,role}=ctx.session.user
        if(role==='admin'){
            const data=await User.find({});
            ctx.render('admin',{data})
        }else{
            ctx.redirect('/')
        }
    },
    loginOut:async (ctx) => {
        ctx.session.user=''
        ctx.redirect('/')
    },
    showSignup:async (ctx) => {
        ctx.render('signup')
    },
    getUser:async (ctx) => {
        let {uname}=ctx.request.body;
        let user=await User.find({uname});
        if (user.length===0){
            ctx.body={code:'001',msg:uname+'可以注册'};
        }else{ctx.body={code:'002',msg:uname+'已被注册'}}
    },
    signup:async (ctx) => {
        const {uname,email,pwd}=ctx.request.body
        const head_img='/upload_cover/' + path.basename(ctx.request.files.headimg.path);
        let user=await User.find({uname})
        if(user.length===0){
            user=new User({uname,email,pwd,head_img})
            user.save();
            ctx.session.user={id:user._id,uname:user.uname,head_img:user.head_img}
            ctx.redirect('/')
        }else{

            ctx.body={code:'002',msg:'用户已存在'}
        }
    },

}

module.exports=user
