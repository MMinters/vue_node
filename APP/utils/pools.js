const pool = require('../pool.js');
const utils = require("./index.js");
/**
 * @param sql sql语句
 * @param val ？另加值
 * @param msg 错误提示语
 * @param run 是否直接返回结果 默认是
 * @param res 响应主体
 * @param req 请求主体
 * */
module.exports=function pools({sql,val=[],msg,run=true,res,req}={}){
    return new Promise((resolve)=>{
        pool.query(sql, val,(err, result) => {
            if (err) return res.send(utils.returnData({code: -1, msg,err,req}));
            if(run) return resolve({result});
            return res.send(utils.returnData({ data: result }));
        });
    })
}