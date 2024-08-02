import request from "@/utils/axios";

export function addTests(data) {
	return request({
		path: "/tests/addTests",
        data
	});
}

export function getTests(data) {
	return request({
		path: "/tests/getTests",
        data
	});
}

export function upTests(data) {
	return request({
		path: "/tests/upTests",
        data
	});
}

export function delTests(data) {
	return request({
		path: "/tests/delTests",
        data
	});
}
//菜单权限接口测试
export function checkMenu(data) {
	return request({
		path: "/tests/checkMenu",
        data
	});
}

//角色权限接口测试
export function checkRole(data) {
	return request({
		path: "/tests/checkRole",
        data
	});
}

//添加文件
export function addFile(data) {
	return request({
		path: "/tests/addFile",
        data
	});
}

//查询图片
export function getImg(data) {
	return request({
		path: "/tests/getImg",
        data
	});
}
//查询文件
export function getFile(data) {
	return request({
		path: "/tests/getFile",
        data
	});
}

//修改文件
export function upFileReq(data) {
	return request({
		path: "/tests/upFile",
        data
	});
}

//删除文件
export function delFile(data) {
	return request({
		path: "/tests/delFile",
        data
	});
}

//下载模板
export function downloadTemplate(data) {
	return request({
		path: "/tests/downloadTemplate",
        data,
		responseType: "blob"
	});
}

//导出测试数据
export function exportTest(data) {
	return request({
		path: "/tests/exportTest",
        data,
		responseType: "blob"
	});
}
