
const express = require("express");
const router = express.Router();
const utils = require("../../utils/index.js");
const fileEvent = require('../../utils/file');

router.post('/file',async(req,res,next)=>{
    await utils.getUserInfo({req,res});
    let result=await fileEvent(req,res);
    res.send(utils.returnData({data:result}))
});

module.exports = router;
