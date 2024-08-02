import request from "@/utils/axios";

//添加文件
export function addFile(data) {
    return request({
        path: "/components/addFile",
        data
    });
}

//查询图片
export function getImg(data) {
    return request({
        path: "/components/getImg",
        data
    });
}
//查询文件
export function getFile(data) {
    return request({
        path: "/components/getFile",
        data
    });
}

//修改文件
export function upFileReq(data) {
    return request({
        path: "/components/upFile",
        data
    });
}

//删除文件
export function delFile(data) {
    return request({
        path: "/components/delFile",
        data
    });
}

//添加富文本
export function addDitor(data) {
    return request({
        path: "/components/addDitor",
        data
    });
}

//查询富文本
export function getDitor(data) {
    return request({
        path: "/components/getDitor",
        data
    });
}

//修改富文本
export function upDitor(data) {
    return request({
        path: "/components/upDitor",
        data
    });
}

//删除富文本
export function delDitor(data) {
    return request({
        path: "/components/delDitor",
        data
    });
}
