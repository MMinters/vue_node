const express = require('express');
const router = express.Router();
const utils = require("../utils/index.js");
const pools = require("../utils/pools.js");
//添加文件
router.post("/addFile", async (req, res) => {
    let sql = "INSERT INTO files(val,type) VALUES (?,?)",
        obj = req.body;
    await pools({sql,val:[obj.val, obj.type],run:false,res,req});
});

//查询图片
router.post("/getImg", async (req, res) => {
    let sql = `SELECT id,val,update_time AS updateTime,create_time AS createTime FROM files WHERE type=1`,obj=req.body;
    let {total}=await utils.getSum({sql,name:"files",res,req});
    sql+=` ORDER BY id DESC`;
    sql=utils.pageSize(sql,obj.page,obj.size);
    let {result}=await pools({sql,res,req});
    res.send(utils.returnData({ data: result ,total}));
});
//查询文件
router.post("/getFile", async (req, res) => {
    let sql = `SELECT id,val,update_time AS updateTime,create_time AS createTime FROM files WHERE type=2`,obj=req.body;
    let {total}=await utils.getSum({sql,name:"files",res,req});
    sql+=` ORDER BY id DESC`;
    sql=utils.pageSize(sql,obj.page,obj.size);
    let {result}=await pools({sql,res,req});
    res.send(utils.returnData({ data: result ,total}));
});
//修改文件
router.post("/upFile", async (req, res) => {
    let sql = "UPDATE  files SET val=? WHERE id=?",
        obj = req.body;
    await pools({sql,val:[obj.val,obj.id],run:false,res,req});
});
//删除文件
router.post("/delFile", async (req, res) => {
    let sql = "DELETE FROM files WHERE id=?",
        obj = req.body;
    await pools({sql,val:[obj.id],run:false,res,req});
});

//添加富文本
router.post("/addDitor", async (req, res) => {
    let sql = "INSERT INTO ditor(val) VALUES (?)",
        obj = req.body;
    await pools({sql,val:[obj.val],run:false,res,req});
});

//查询富文本
router.post("/getDitor", async (req, res) => {
    let sql = `SELECT id,val,update_time AS updateTime,create_time AS createTime FROM ditor WHERE 1=1`,obj=req.body;
    let {total}=await utils.getSum({sql,name:"ditor",res,req});
    sql+=` ORDER BY id DESC`;
    sql=utils.pageSize(sql,obj.page,obj.size);
    let {result}=await pools({sql,res,req});
    res.send(utils.returnData({ data: result ,total}));
});

//修改富文本
router.post("/upDitor", async (req, res) => {
    let sql = "UPDATE  ditor SET val=? WHERE id=?",
        obj = req.body;
    await pools({sql,val:[obj.val,obj.id],run:false,res,req});
});

//删除富文本
router.post("/delDitor", async (req, res) => {
    let sql = "DELETE FROM ditor WHERE id=?",
        obj = req.body;
    await pools({sql,val:[obj.id],run:false,res,req});
});
module.exports = router;
