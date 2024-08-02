<template>
  <div>
    <el-dialog :title="title" :visible.sync="open" width="400px" append-to-body :close-on-click-modal="false">
      <el-upload
        ref="upload"
        :limit="limit"
        :accept="accept"
        :headers="headers"
        :action="action"
        :data="params"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :on-error="handleFileError"
        :auto-upload="false"
        drag
        :disabled="upLoading"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip" style="text-align: right">
          <el-link v-loading="impLoading" v-if="showTemplate" type="primary"  @click="downloadTemplate"
          >下载模板</el-link>
        </div>
        <div v-if="accept" class="el-upload__tip" style="color: red" slot="tip">
          提示：仅允许导入{{accept}}格式文件！
        </div>
      </el-upload>
      <div v-loading="upLoading" slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getToken} from "@/utils/auth";
export default {
  name: "HandleImport",
  props:{
    //一次性上传的数量
    limit:{
      type:Number,
      default:1
    },
    accept:{
      type:String,
      default:".xlsx,.xls"
    },
    //上传地址
    url:{
      type:String,
      default:""
    },
    //显示下载模板按钮
    showTemplate:{
      type:Boolean,
      default:true
    },
    //显示导入方式
    sign:{
      type:Boolean,
      default:false
    },
    parentParams:{
      type:Object,
      default:()=>{return {}}
    }
  },
  data(){
    return {
      // 是否显示弹出层（用户导入）
      open: false,
      // 弹出层标题（用户导入）
      title: "文件上传",
      // 是否禁用上传
      upLoading: false,
      impLoading:false,
      // 设置上传的请求头部
      headers: { Token: getToken() },
      // 上传的地址
      action: "",
      //上传附带的参数
      params:{
        sign:"insert",
        listType:"",
        activityCode:""
      }
    }
  },
  created() {
    this.action=process.env.VUE_APP_BASE_API+this.url;
  },
  methods:{
    show(){
      this.open=true;
    },
    /** 下载模板操作 */
    downloadTemplate() {
      this.impLoading=true;
      this.$emit("downloadTemplate",{call:()=>{
          setTimeout(()=>{this.impLoading=false;},1500);
        }});
    },
    //上传失败
    handleFileError(e){
      this.open = false;
      this.upLoading = false;
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upLoading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upLoading = false;
      this.$refs.upload.clearFiles();
      if(response.code!==1) return this.$message.error(response.msg||"导入失败！");
      this.open = false;
      this.$emit("importRes",response);
    },
    // 提交上传文件
    submitFileForm() {
      this.$set(this.params,"activityNumber",this.parentParams.activityCode);
      this.$set(this.params,"listType",this.parentParams.listType);
      this.$refs.upload.submit();
    }
  }
}
</script>

<style scoped>

</style>
