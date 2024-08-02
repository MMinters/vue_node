const express = require('express');
const bodyparser = require('body-parser'); //body中间件
const cors = require('cors'); //解决跨域的中间件
const utils = require("./utils/index.js");
const {errLog}= require("./utils/err");
const server = express();
server.listen(3000);
server.use(cors({origin: "*",}));
server.use(express.static('./public')); //用户的静态资源
server.use(bodyparser.json());
// server.use(bodyparser.urlencoded({//body中间件
// 	extended:false
// }));
server.use(async function (req, res, next)  {
	if(req.headers.token){
		let user=await utils.getUserInfo({req,res});
		if(user.status===0) return res.send(utils.returnData({code: 203, msg: "你账号已被禁用，请联系管理员！！",req}));
	}
	next();
})
process.on('unhandledRejection', (err, test) => {
	errLog({err,code:500,msg:"后端系统错误！",funName:"fatal"});
	}).on('uncaughtException', err => {
	errLog({err,code:500,msg:"后端系统错误！！",funName:"fatal"});
	});
const adminRouter = require('./router/system/admin.js'); //管理菜单等路由
const fileRouter = require('./router/system/file.js'); //文件等路由
const testsRouter=require("./router/tests.js");//测试信息路由
const componentsRouter=require("./router/components.js");//测试信息路由
server.use('/admin', adminRouter);
server.use('/file', fileRouter);
server.use("/tests",testsRouter);
server.use("/components",componentsRouter);
console.log('后端接口启动成功');
