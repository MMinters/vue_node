<template>
  <div class="file-box">
    <el-upload
        :action="action"
        :list-type="listType"
        :multiple="multiple"
        ref="upImg"
        :limit="limit"
        :file-list="fileList"
        :headers="headers"
        :drag="drag"
        :accept="accept"
        :on-success="onSuccess"
        :on-remove="onRemove"
        :before-upload="beforeUpload"
        :on-exceed="handleExceed"
        :on-preview="handlePictureCardPreview"
        :disabled="isDisabled"
    >
      <i class="el-icon-plus" v-if="listType==='picture-card'"></i>
      <el-button v-else size="small" type="primary" plain style="margin-top: 5px">点击选择</el-button>
      <!--      <i class="el-icon-upload"></i>-->
      <div v-if="drag" class="el-upload__text"><em>支持拖拽上传</em></div>
      <div v-if="accept" class="el-upload__tip" slot="tip">只能上传类型：{{accept}}</div>
      <div v-if="size" class="el-upload__tip" slot="tip">最大不超过：{{size}} M</div>
    </el-upload>
    <el-dialog   :visible.sync="dialogVisible" size="tiny" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="预览">
    </el-dialog>
  </div>
</template>

<script>
import {getToken} from "@/utils/auth";

export default {
  name: "upFile",
  props:{
    //文件数量 为0 不限制
    limit:{
      type:Number,
      default: 0
    },
    //是否多选
    multiple:{
      type:Boolean,
      default:true
    },
    //默认列表 {url,name,upUrl}
    fileList:{
      type:Array,
      default: ()=>[]
    },
    //是否拖拽
    drag:{
      type:Boolean,
      default:false
    },
    //展示类型  picture-card/picture/text
    listType:{
      default:"picture-card"
    },
    //文件类型 为空不限制 .jpg,png
    accept:{
      type:String,
      default:""
    },
    //文件大小限制，为0不限制   单位M
    size:{
      type:Number,
      default: 0
    },
    //是否禁用
    isDisabled:{
      type:Boolean,
      default:false
    }
  },
  data(){
    return {
      dialogImageUrl:"",
      dialogVisible:false,
      action:process.env.VUE_APP_BASE_API+"/file/file",
      headers:{token:getToken()},
      list:[]
    }
  },
  watch:{
    fileList(list){
      this.list=list;
    }
  },
  methods:{
    getFileRes(){
      return this.list;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    onSuccess(res){
      let {data,code,msg}=res;
      if(code===203) {
        this.$message.error("登陆失效，请重新登陆！");
        this.$store.dispatch('user/logout');
        return;
      }
      if(code!=1) return this.$message.error(msg||"上传失败！");
      this.list=this.list.concat(data)
      this.$emit("upSuccess",{data});
    },
    onRemove(res){
      let {response}=res;
      let data=response?response.data:[res];
      let index=this.list.findIndex(t=>t.url==data[0].url);
      this.list.splice(index,1)
      if(response) return this.$emit("upRemove",{data});
      this.$emit("upRemove",{data});
    },
    beforeUpload(res){
      let {size,accept}=this;
      if(size&&(res.size/1024/1024)>size){
        this.$message.error(`最大不超过${size} M`);
        return false;
      };
      if(accept){
        const regex = /\.([^.]*)$/;
        const match = res.name.match(regex);
        const result = match ? match[0] : "";
        if(!accept.includes(result)){
          this.$message.error(`只能上传类型：${accept}`);
          return false;
        }
      }
      return true;
    },
    handleExceed() {
      this.$message.error(`一次性最多可上传：${this.limit}个`);
    },
    clearFiles(){
      this.list=[];
      this.$refs.upImg.clearFiles();
    },
  }
}
</script>

<style scoped lang="scss">
  .file-box{
    ::v-deep .el-upload-dragger{
      width: 148px;
      height: 148px;
      .el-upload__text{
        width: 100%;
        position: absolute;
        top: 45px;
      }
    }
    ::v-deep .el-upload__tip{
      line-height: 15px;
    }
  }
</style>
