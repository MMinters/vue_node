![海报](https://foruda.gitee.com/images/1730987419940406063/1bb88502_8986810.png "vue+node开源后台")



<p align="center">
   	<a href='https://gitee.com/MMinter/vue_node/stargazers'><img src='https://gitee.com/MMinter/vue_node/badge/star.svg?theme=dark' alt='star'></img></a>
	<a href='https://gitee.com/MMinter/vue_node/members'><img src='https://gitee.com/MMinter/vue_node/badge/fork.svg?theme=white' alt='fork'></img></a>
 	<img src="https://img.shields.io/badge/Vue-2.6.10-orange" alt="Vue2"/>
	<img src="https://img.shields.io/badge/Node-10.0.0~16.0.0-brightgreen" alt="Node"/>
	<img src="https://img.shields.io/badge/Element-2.15.13-green" alt="Element2"/>
	<img src="https://img.shields.io/badge/MySQL-2.17.1-blue" alt="Mysql"/>
</p>

<p align="center">
    <a href="https://qm.qq.com/q/eCq31JHktO">
    交流QQ群（717807656）
    <img src="https://pub.idqqimg.com/wpa/images/group.png" alt="qq群：717807656"/>
    </a>
</p>

## 最新消息：<a href="https://gitee.com/MMinter/vue_node_wiki/wikis/vue+node交流群" target="_blank">vue3版本开发完成！点击获取最新vue3源码</a>



### 最新版本预览地址：<a href="http://vuenodeupgrade.yknba.cn/#/login" target="_blank">点击进入效果预览</a>

- 默认账号：admin
- 默认密码：666666

### 升级新功能如下：

1. 整体进行优化代码，使得更小更容易上手。
2. 加入登陆图形验证码验证，升级密码加密难度。
3. 加入下载模板、导入、导出功能。
4. 加入上传图片、上传文件（视频、音频等其他格式文件）。
5. 加入个人信息管理页面。
6. 加入富文本编辑功能。
7. 加入大屏统计echarts展示功能。
8. 页面合成图片、动态二维码合成（vue3独有）
9. Redis辅助（vue3独有）
10. 拖拽可视化（vue3独有）
11. 图片管理模式（vue3独有）
12. 持续更新中...
------

### **《本开源库衍生的真实线上微信小程序》**：

1. ​	*入口一：微信上搜索小程序：共享wx*
2. ​	*入口二：微信扫码以下二维码体验效果*

<p align="center">
     <img src="https://foruda.gitee.com/images/1706259979478250995/03d1fb75_8986810.jpeg" alt="qq群：717807656"/>
</p>







## 一、项目预览地址

- #### 升级版：<a href="http://vuenodeupgrade.yknba.cn/#/login" target="_blank">点击进入效果预览</a>

-    默认账号：admin

-    默认密码：666666




## 二、交流群、问题解答入口

- #### 	<a href="https://gitee.com/MMinter/vue_node_wiki/wikis/vue+node交流群" target="_blank">点击加入 问题解答交流社区</a>

## 三、项目启动



- ### 		前端页面启动

1. ##### #克隆项目

   ```
   git https://github.com/MMinters/vue_node.git
   ```

2. ##### #进入目录

   ```
   cd item
   ```

3. ##### #安装依赖（建议使用node版本16以下  10以上）

   ```
   npm install
   ```

4. ##### #启动项目

   ```
   npm run dev
   ```




- ### 		数据库导入

1. ##### 				#创建数据库  

   1. 创建数据库 名：**vue_admin**
   2. 基字符集 选：默认（default） 或者 utf8
   3. 排序规则 选：默认（default） 或者 utf8_general_ci

2. ##### #导入数据库

   1. 将APP/数据库 文件夹的vue_admin.sql导入新建的vue_admin库中。

3. ##### #数据库配置信息

   ```
   //配置文件在APP/poo.js 中，请根据自身环境配置
   const pool=mysql.createPool({
   	host:"127.0.0.1",
   	port:3306,//端口
   	user:"root",//账户名
   	password:"root",//登录密码
   	database:"vue_admin",//数据库名称
   	connectionLimit:15
   });
   ```





- ### 		后端服务启动


1. ##### 				#克隆项目（如果已经执行了前端页面启动的克隆，可略过这点）

   ```
   git clone https://github.com/MMinters/vue_node.git
   ```

2. #####  #进入目录

   ```
   cd APP
   ```

3. ##### #安装依赖

   ```
   npm install
   ```

4. ##### #启动服务

   ```
   npm run dev
   ```





## 四、功能简明

- #### 		前端功能 (<a href="https://gitee.com/MMinter/vue_node_wiki/wikis/前端功能详解" target="_blank">点击进入前端功能详细文档</a>)

  > - [x] 
  >   	​			***动态路由***	
  > - [x] ​			***菜单管理***
  > - [x] ​			***用户管理***
  > - [x] ​			***角色管理***
  > - [x] ​			***多账号管理***
  > - [x] ​			***字典管理***
  > - [x] ​			***主题自定义***	
  > - [x] ​			***菜单权限***
  > - [x] ​			***角色权限***



- #### 		后端功能 (<a href="https://gitee.com/MMinter/vue_node_wiki/wikis/后端功能详解" target="_blank">点击进入后端功能详细文档</a>)

  > - [x] 
  >   	​			***jsonwebtoken（token）***
  > - [x] ​			***菜单权限拦截***
  > - [x] ​			***角色权限拦截***
  > - [x] ​			***错误日志log`***



## 五、效果截图

| ![登录](https://foruda.gitee.com/images/1730969967158316226/8ad79a04_8986810.jpeg "登录.jpg") | ![大屏展示](https://foruda.gitee.com/images/1730970786918750491/e04c52c8_8986810.jpeg "大屏展示.jpg") |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![页面生成图](https://foruda.gitee.com/images/1730970844379745523/ba8d8df5_8986810.jpeg "页面生成图.jpg") | ![拖拽](https://foruda.gitee.com/images/1730971061198872018/e4fb905a_8986810.jpeg "拖拽.jpg") |
| ![图片库](https://foruda.gitee.com/images/1730971146843912280/77457fe4_8986810.jpeg "图片库.jpg") | ![富文本](https://foruda.gitee.com/images/1730971172194083489/262388d2_8986810.jpeg "富文本.jpg") |
| ![用户管理](https://foruda.gitee.com/images/1681197937191145993/c434e92e_8986810.png "用户管理.png") | ![主题修改](https://foruda.gitee.com/images/1681263456631597583/3077263f_8986810.png "主题修改.png") |
| ![菜单管理](https://foruda.gitee.com/images/1681197808163981644/96f27575_8986810.png "菜单管理.png") | ![菜单修改](https://foruda.gitee.com/images/1681197825348384952/281da67c_8986810.png "菜单修改.png") |
| ![角色管理](https://foruda.gitee.com/images/1681197773630264222/4ec415e3_8986810.png "角色管理.png") | ![字典管理](https://foruda.gitee.com/images/1681197948454663203/788cbd7e_8986810.png "字典管理.png") |
------

------

------

## <a href="https://gitee.com/MMinter/vue_node_wiki/wikis/vue3.0支持名单（QQ）" target="_blank">vue3.0支持名单！点击浏览</a>
