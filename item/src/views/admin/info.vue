<template>
  <div class="box" style="text-align: center">
    <upFile ref="upFile" :file-list="fileList" :limit="1" :size="1" accept=".jpg,.png,.gif,.jpeg"></upFile>
    <el-row type="flex" justify="center" style="margin-top: 30px">
      <el-col :span="6">
        <el-form class="demo-form-inline" label-width="80px" :model="form" :rules="rules" ref="form">
          <el-form-item label="登陆账号" prop="name">
            <el-input v-model="form.name" placeholder="请输入登陆账号" />
          </el-form-item>
          <el-form-item label="登陆密码" prop="pwd">
            <el-input type="password" disabled v-model="form.pwd" placeholder="请输入登陆密码" >
            <template slot="append"> <el-button type="danger"  @click="upUserPwdInfo" style="background: #f56c6c;color: #fff">修改密码</el-button></template>
            </el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="upSave">确认修改</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {upUserInfo,upUserPwdInfo} from "@/api/admin";
import upFile from "@/components/upFile";
import md5 from 'js-md5';
export default {
  name: "Info",
  data(){
    return {
      fileList:[],
      form:{
        pwd:"***********",
        name:""
      },
      rules:{
        name: [
          { required: true, message: '请输入登陆账号', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '请输入登陆密码', trigger: 'blur' },
        ],
      }
    }
  },
  mounted(){
    this.form.name=this.$store.state.user.name;
    this.fileList=[{name:"",url:this.$store.state.user.avatar}];
  },
  methods:{
    upSave(){
      this.$refs.form.validate(async (validate)=>{
        if(!validate) return;
        let imgArr=this.$refs.upFile.getFileRes();
        if(imgArr.length===0) return this.$message.error("请选择头像图片！");
        this.form.url=imgArr[0].url;
        await upUserInfo(this.form);
        this.$store.commit("user/SET_NAME",this.form.name);
        this.$store.commit("user/SET_AVATAR",this.form.url);
        this.$message.success("修改成功！");
      })
    },
    upUserPwdInfo(){
      this.$prompt('请输入需要修改密码，修改后需要重新登陆！', '修改提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[^\u4e00-\u9fa5]{6,15}$/,
        inputErrorMessage: '密码需要6-15位不为中文密码'
      }).then(async ({ value }) => {
        await upUserPwdInfo({pwd:md5(this.$nodeMD5+value)});
        this.$message.success("修改成功！");
        await this.$store.dispatch('user/logout')
      })
    }
  },
  components:{
    upFile
  }
}
</script>

<style scoped>

</style>
