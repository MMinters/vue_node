const jwt = require("jsonwebtoken");
const pool = require("../pool.js");
const {errLog}=require("../utils/err");
//日志记录
module.exports = {
    poolsEvent(){
        const pools = require("./pools");
        return pools
    },
    setToken({uid,captcha,name="user"}) {
        let token = jwt.sign({uid,captcha}, name, {
            expiresIn: "86400s", // 授权时间
        });
        return token;
    },
    verToken({token,name="user"}) {
        try {
            return jwt.verify(token, name);
        } catch (err) {
            return false;
        }
    },
    /**
     * 判断名称是否重复
     * @param sql  sql语句
     * @param name  sql查询参数name
     * @param msg  提示语
     * @param req  请求主体
     * @param res  响应主体
     * */
    async existName({sql, name,msg="名称已存在！",req,res}) {
        if(!name) return true;
        let {result}=await this.poolsEvent()({sql,res,req,val:[name]});
        if (result.length > 0){
            res.send(this.returnData({code:-1,msg,req}))
            return Promise.reject(false);
        }
        return true;
    },
    /**
     * 判断修改的名称是否和修改前的一样
     * @param sql  sql语句
     * @param sqlName  修改前的属性名
     * @param name  修改后的值
     * @param id  sql条件参数
     * @param req  请求主体
     * @param res  响应主体
     * */
    async judgeUserName({sql,sqlName="name", name,id,req,res}) {
        let {result}=await this.poolsEvent()({sql,val:[id],res,req});
        if (result[0][sqlName] == name) return -1;
        return 1;
    },
    /**
     * 响应总函数
     * @param code  状态码
     * @param msg  提示文字
     * @param total  查询总数量
     * @param data  数据
     * @param err  错误信息
     * @param req  错误信息
     * @param funName  错误信息记录名称
     * */
    returnData({code = 1, msg, total=undefined,data = {},err,req={},funName} = {}) {
        if (code == 1 && !msg) msg = "请求成功！";
        if (code == -1 && !msg) msg = "服务器异常！";
        if (code == 203 && !msg) msg = "登陆失效，请重新登陆！";
        let res={code, msg, data};
        if(total!==undefined) res.total=total;
        if(err) res.err=err;
        //记录错误日志
        if(code!=1) errLog({err,code,msg,req,funName});
        return res;
    },
    /**
     * 获取用户信息
     * @param req  请求主体
     * @param res  响应主体
     * @param addMore  是否拒绝管理员添加多账户信息
     * */
    async getUserInfo({req, res,addMore=false}={}) {
        let token = req.headers.token;
        if (!token) {
            res.send(this.returnData({code: 203,req}));
            return Promise.reject(false);
        }
        let user = this.verToken({token});
        if (!user) {
            res.send(this.returnData({code: 203,req}));
            return Promise.reject(false);
        }
        let sql = "SELECT id,name,status,roles_id AS rolesId,admin,more_id AS moreId,url FROM user WHERE id=?";
        let {result}=await this.poolsEvent()({sql,val:[user.uid],res,req});
        if (result.length === 0) {
            res.send(this.returnData({code: -1, msg: "用户不存在！",req}));
            return Promise.reject(false);
        }
        if(addMore&&result[0].admin===1) {
            res.send(this.returnData({code: -1, msg: "终极管理员无权 增加多账号数据~",req}));
            return Promise.reject(false);
        }
        return result[0];
    },

    /**
     * 获取用户权限
     * @param req  请求主体
     * @param res  响应主体
     * */
    async getUserRole(req, res) {
        let user = await this.getUserInfo({req, res});
        let userSql = "SELECT roles,role_key FROM roles WHERE FIND_IN_SET(id,?)";
        let {result}=await this.poolsEvent()({sql:userSql,val:[user.rolesId],res,req});
        if (result.length == 0) {
            res.send(this.returnData({code:-1,msg:"获取权限失败！",req}));
            return Promise.reject(false);
        }
        let roles = result.map(t => t.roles);
        //权限字符
        let roleKey=result.map(t=>t.role_key);
        //角色权限
        let roleAdmin=roleKey.some(t=>t==="admin");
        return {userRole: roles.join(","),roleKey,user,roleAdmin};
    },
    /**
     * 菜单字符权限拦截
     * @param req  主体
     * @param res  主体
     * @param role  接口权限字符数组
     * @param admin  是否管理员也要遵守（默认否）
     * @param run  是否不拦截，返回结果
     * */
    async checkPermi({req,res,role=[],admin=false,run=false}){
        let userRole=await this.getUserRole(req,res);
        if((userRole.roleAdmin|| userRole.user.admin===1)&&!admin) return true;
        let sql = "SELECT role_key AS roleKey FROM router_menu WHERE FIND_IN_SET(id,?)";
        let {result}=await this.poolsEvent()({sql,val:[userRole.userRole],res,req});
        try {
            let roleKeyArr=result.map(t=>t.roleKey).filter(t=>t);
            const hasPermission = role.some(permission => {
                return roleKeyArr.includes(permission)
            });
            if(hasPermission||run) return hasPermission;
            res.send(this.returnData({code:-1,msg:"暂无此功能请求权限！",req}));
            return Promise.reject(false);
        }catch (e) {
            res.send(this.returnData({code:-1,msg:"菜单权限判断错误！！",req}));
            return Promise.reject(false);
        }
    },
    /**
     * 角色权限拦截
     * @param req  主体
     * @param res  主体
     * @param role  角色权限数组
     * @param admin  是否管理员也要遵守（默认否）
     * @param run  是否不拦截，返回结果
     * */
    async checkRole({req,res,role=[],admin=false,run=false}){
        try {
            let userRole=await this.getUserRole(req,res);
            if((userRole.roleAdmin|| userRole.user.admin===1)&&!admin) return true;
            let roleKeyArr=userRole.roleKey;
            const hasPermission = role.some(permission => {
                return roleKeyArr.includes(permission)
            });
            if(hasPermission||run) return hasPermission;
            res.send(this.returnData({code:-1,msg:"暂无对应角色请求权限！",req}))
            return Promise.reject(false);
        }catch (e) {
            res.send(this.returnData({code:-1,msg:"角色权限判断错误！",err:e,req}))
            return Promise.reject(false);
        }

    },
    /**
     * 是否操作的是用户总管理员
     * @param req  请求主体
     * @param res  响应主体
     * @param id  查询条件id
     * */
    async upAdmin({req,res,id}){
        let sql = "SELECT admin FROM user WHERE id=?";
        let {result}=await this.poolsEvent()({sql,val:[id],res,req});
        if(result.length===0){
            res.send(this.returnData({code:-1,msg:"管理信息判断错误！",req}));
            return Promise.reject(false);
        }
        if(result[0].admin===1) {
            res.send(this.returnData({code:-1,msg:"无法对《总管理》执行此操作！",req}));
            return Promise.reject(false);
        }
        return result;
    },
    /**
     * 是否操作的是角色总管理员
     * @param req  请求主体
     * @param res  响应主体
     * @param id  查询条件id
     * */
    async upAdminRole({req,res,id}){
        let sql = "SELECT role_key FROM roles WHERE id=?";
        let {result}=await this.poolsEvent()({sql,val:[id],res,req});
        if(result.length===0) {
            res.send(this.returnData({code:-1,msg:"管理信息判断错误！！",req}));
            return Promise.reject(false);
        }
        if(result[0].role_key==="admin") {
            res.send(this.returnData({code:-1,msg:"无法对《角色总管理》执行此操作！",req}));
            return Promise.reject(false);
        }
        return result;

    },
    /**
     * 通过id获取用户信息
     * @param req  请求主体
     * @param res  响应主体
     * @param id  查询条件id
     * */
    async getUserId({req,res,id}){
        let sql = "SELECT admin FROM user WHERE id=?";
        let {result}=await this.poolsEvent()({sql,val:[id],res,req});
        if(result.length===0) {
            res.send(this.returnData({code:-1,msg:"用户信息错误！！",req}));
            return Promise.reject(false);
        }
        return result[0];
    },
    /**
     * 分页页码处理
     * @param sql  sql语句
     * @param page  页码
     * @param size  最大数量
     * */
    pageSize(sql,page,size){
        if(!page){page=1};
        if(!size){size=10};
        page = (page-1)*size;
        size = parseInt(size);
        return sql+=` LIMIT ${page},${size}`;
    },
    /**
     * 查询总数
     * @param sql  sql语句
     * @param name  表名
     * @param res  响应主体
     * @param req  请求主体
     * */
    async getSum({sql="",name,res,req}) {
        const regex = /WHERE(.+)/;
        const result = sql.match(regex);
        let where="1=1";
        if (result && result[1])  where = result[1].trim();
        let sqlRes = `SELECT count(1) FROM ${name} WHERE ${where}`;
        let {result:resultRes}=await this.poolsEvent()({sql:sqlRes,res,req});
        return { total: resultRes[0]["count(1)"] };
    },
    /**
     * 将多账户id加入sql判断
     * @param sql  sql语句
     * @param user  用户信息
     * @param name  字段名
     * */
    setMoreId(sql,user,name='more_id'){
        if (user.admin !== 1) return sql += ` AND ${name} = ${user.moreId}`;
        return sql;
    },
    /**
     * 模糊查询
     * @param sql sql语句
     * @param name 字段名
     * @param val 值
     * */
    setLike(sql,name="",val=""){
        if(this.exist(val)) sql+=` AND ${name} LIKE "%${val}%"`;
        return sql
    },
    /**
     * 判断是否为空
     * @param str any
     * */
    exist(str){
        return str !== undefined && str !== "" && str !== null;
    }
};
