<template>
  <div>
    <div style="border: 1px solid #ccc; margin: 0 auto" :style="styleString">
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editor"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
      <Editor
        style="overflow-y: hidden; height: 300px;"
        v-model="html"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="onCreated"
        @onChange="onChange"
      />
    </div>
  </div>
</template>

<script>
//https://www.wangeditor.com/
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import {getToken} from "@/utils/auth";

export default {
  props:{
    //样式
    styleString:{
      type:String,
      default:"width: 100%;"
    },
    //菜单栏配置
    toolbarConfig:{
      type:Object,
      default:()=>{return { excludeKeys:[]}}
    },

  },
  name: "wangeditorIndex",
  data(){
    return{
      html:"",
      editor: null,
      mode: 'default', // or 'simple'
      //基本配置
      editorConfig:{
        placeholder: '请输入内容（可上传图片和视频）...',
        //上传图片的配置
        MENU_CONF:{
          uploadImage:{
            server: process.env.VUE_APP_BASE_API+"/file/file",
            fieldName:"file",
            maxFileSize: 1 * 1024 * 1024,//最大1M
            headers: {
              token:getToken()
            },
           customInsert:async (res, insertFn)=> {
              let {code,data,msg}=res;
              if(code===203) {
                this.$message.error(msg||"登陆失效，请重新登陆！");
                await this.$store.dispatch('user/logout');
                return;
              }
              if(code!=1) return this.$message.error(msg||"上传错误！");
              insertFn(data[0].url, data[0].name, data[0].url)
            },
            // 上传错误，或者触发 timeout 超时
            onError:(file, err, res)=> {  // TS 语法
              this.$message.error(`上传出错：${err}，《请注意，最大可上传 1M 图片》`);
            },
          },
          uploadVideo:{
            server: process.env.VUE_APP_BASE_API+"/file/file",
            fieldName:"file",
            maxFileSize: 3 * 1024 * 1024,//最大3M
            headers: {
              token:getToken()
            },
            customInsert:async (res, insertFn)=> {
              let {code,data,msg}=res;
              if(code===203) {
                this.$message.error(msg||"登陆失效，请重新登陆！");
                await this.$store.dispatch('user/logout');
                return;
              }
              if(code!=1) return this.$message.error(msg||"上传错误！");
              insertFn(data[0].url)
            },
            // 上传错误，或者触发 timeout 超时
            onError:(file, err, res)=> {  // TS 语法
              this.$message.error(`上传出错：${err}，《请注意，最大可上传 3M 视频》`);
            },
          }
        }
      },
    }
  },
  methods:{
    onCreated(editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    //修改触发
    onChange(){
      this.$emit("htmlChage",{html:this.html!=="<p><br></p>"?this.html:""});
    },
    //接收初始值
    htmlInit(e){
      let {html}=e;
      this.html=html;
    }
  },
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  },
  components:{Editor,Toolbar}
}
</script>
<style src="@wangeditor/editor/dist/css/style.css"></style>
<style scoped>

</style>
