<template>
  <div class="box">
    <div style="text-align: center">
      <upFile ref="upFile" :fileList="fileList" listType="text" :size="2" :limit="6"></upFile>
      <el-button v-loading="addLoading" :type="id?'danger':'primary'" style="margin-top: 20px" @click="savePage">{{id?'修改文件':'保存上传'}}</el-button>
    </div>
    <el-button @click="defaultEvent" type="info">回复默认设置</el-button>
    <el-button @click="openDialogVisible" type="success">弹窗上传</el-button>
    <el-table :data="list" style="margin-top: 15px" v-loading="loading">
      <el-table-column label="编号" align="center" width="100" prop="id" />
      <el-table-column label="文件（点击下载）" align="center" prop="val" width="500">
        <template slot-scope="scope">
          <div v-for="t in imgEvent(scope.row)" :key="t.id">
            <el-link type="primary"  target="_blank" :href="t.url">{{t.originalname}}</el-link>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateTime" />
      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column label="操作" align="center" width="250">
        <template slot-scope="scope" >
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="primary" @click="handleDialogEdit(scope.row)">弹窗编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.page"
        :limit.sync="queryParams.size"
        @pagination="getFile"
    />
    <el-dialog
        title="上传文件"
        :visible.sync="dialogVisible"
        width="50%"
        style="text-align: center"
    >
      <upFile ref="upFileDialog" :fileList="fileListDialog" listType="text" :size="2" :limit="6"></upFile>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button :type="id?'danger':'primary'" @click="saveDialog" v-loading="addLoading">{{id?'修改文件':'保存上传'}}</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import upFile from "@/components/upFile";
import {addFile,getFile,upFileReq,delFile} from "@/api/components";
export default {
  name: "File",
  data(){
    return {
      list:[],
      loading:false,
      addLoading:false,
      total:0,
      queryParams:{
        size:10,
        page:1
      },
      fileList:[],
      fileListDialog:[],
      id:undefined,
      dialogVisible:false
    }
  },

  created(){
    this.getFile();
  },
  methods:{
    async getFile(){
      let {data,total}=await getFile(this.queryParams);
      this.list=data;this.total=total;
    },
    //页面上传
    savePage(){
      //获取了文件组件结果
      let list=this.$refs.upFile.getFileRes();
      if(list.length===0) return this.$message.error("请先选择文件！");
      this.save(list);
    },
    //弹窗上传
    saveDialog(){
      let list=this.$refs.upFileDialog.getFileRes();
      if(list.length===0) return this.$message.error("请先选择文件！");
      this.save(list);
    },
    //保存上传
    async save(list){
      try {
        let {id}=this;
        this.addLoading=true;
        id&&await upFileReq({val:JSON.stringify(list),id})
        !id&&await addFile({type:2,val:JSON.stringify(list)});
        this.addLoading=false;
        this.id=undefined;
        this.getFile();
        this.$message.success(id?"修改成功":"保存成功！");
        this.$refs.upFile.clearFiles();
        //如果是弹窗
        if(this.dialogVisible){
          this.$refs.upFileDialog.clearFiles();
          this.dialogVisible=false;
        }
      }catch (e) {
        this.addLoading=false;
      }
    },
    handleDelete(row){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(async ()=>{
        await delFile(row);
        this.getFile();
        this.$message.success("删除成功！");
      })
    },
    openDialogVisible(){
      this.dialogVisible=true;
      this.id=undefined;
      this.$nextTick(()=>{
        this.$refs.upFileDialog.clearFiles();
      })
    },
    //页面修改
    handleEdit(row){
      //回显文件
      this.$set(this,"fileList",this.imgEvent(row));
      this.id=row.id;
    },
    //弹窗修改
    handleDialogEdit(row){
      this.dialogVisible=true;
      this.$nextTick(()=>{
        this.$set(this,"fileListDialog",this.imgEvent(row));
        this.id=row.id;
      });
    },
    defaultEvent(){
      this.id=undefined;
      this.$refs.upFile.clearFiles();
    },
    imgEvent(row){
      try {
        return JSON.parse(row.val)
      }catch (e) {
        return []
      }
    }
  },
  components:{upFile}
}
</script>

<style scoped lang="scss">

</style>
