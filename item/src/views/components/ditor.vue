<template>
  <div class="box">
    <wangeditor @htmlChage="htmlChage" ref="wangeditor"></wangeditor>
    <el-button style="float: left;margin-top: 10px" type="info" @click="recover">恢复初始状态</el-button>
    <div style="text-align: right;margin-top: 10px" v-loading="addLoading"> <el-button type="primary" @click="addDitor">新增</el-button> <el-button type="danger" @click="changeEvent">修改</el-button></div>
    <el-table :data="list" v-loading="loading" style="margin-top: 20px">
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="富文本值" align="center" prop="val">
        <template slot-scope="scope">
          <el-button type="success" @click="look(scope.row)">点击查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateTime" :formatter="formatterUpdateTime"   />
      <el-table-column label="创建时间" align="center" prop="createTime"  />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">修改</el-button>
          <el-button size="mini" type="danger" @click="delDitor(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.page"
        :limit.sync="queryParams.size"
        @pagination="getDitor"
    />

    <el-dialog
        title="查看富文本"
        :visible.sync="dialogVisible"
        width="80%"
        style="text-align: center"
    >
      <div class="html-val" v-html="htmlVal"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
import wangeditor from "@/components/wangeditor";
import {addDitor,getDitor,upDitor,delDitor} from "@/api/components";

export default {
  name: "Ditor",
  data(){
    this.val="";
    return {
      list:[],
      loading:false,
      addLoading:false,
      dialogVisible:false,
      id:undefined,
      htmlVal:"",
      queryParams:{
        size:10,
        page:1
      },
      total:0
    }
  },
  created(){
    this.getDitor();
  },
  methods:{
    addDitor(){
      if(this.id) return this.$message.error("当前模式属于修改模式，请点击修改按钮！");
      if(!this.val) return this.$message.error("请输入内容！");
      this.$confirm('确定要保存当前富文本内容吗?', '新增提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async ()=>{
        try {
          this.addLoading=true;
          await addDitor({val:this.val});
          this.$refs.wangeditor.htmlInit({html:""});
          this.addLoading=false;
          this.getDitor();
          this.$message.success("新增成功！");
        }catch (e) {
          this.addLoading=false;
        }
      })
    },
    changeEvent(){
      if(!this.id) return this.$message.error("当前模式属于新增模式，请点击新增按钮！");
      if(!this.val) return this.$message.error("请输入内容！");
      this.$confirm('确定要修改当前富文本内容吗?', '修改提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async ()=>{
        try {
          this.addLoading=true;
          await upDitor({val:this.val,id:this.id});
          this.$refs.wangeditor.htmlInit({html:""});
          this.addLoading=false;
          this.getDitor();
          this.$message.success("修改成功！");
        }catch (e) {
          this.addLoading=false;
        }
      })
    },
    delDitor(row){
      this.$confirm('确定要删除此富文本吗？?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async ()=>{
        await delDitor({val:this.val,id:row.id});
        this.getDitor();
        this.$message.success("删除成功！");
      })
    },
    async getDitor(){
      this.id=undefined;
      let {data,total}=await getDitor(this.queryParams);
      this.list=data;this.total=total;
    },
    look(row){
      this.htmlVal=row.val;
      this.dialogVisible=true;
    },
    //输入监听函数
    htmlChage({html}){
      this.val=html;
    },
    handleEdit(row){
      this.id=row.id;
      this.$refs.wangeditor.htmlInit({html:row.val});
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    },
    recover(){
      this.id=undefined;
      this.$refs.wangeditor.htmlInit({html:""});
    },
    formatterUpdateTime(row){
      return row.updateTime||row.createTime
    }
  },
  components:{
    wangeditor
  }
}
</script>

<style lang="scss">
  .html-val{
    img{
      width: 100%;
    }
  }
</style>
