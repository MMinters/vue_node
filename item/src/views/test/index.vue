<template>
  <div class="box">
    <el-form
        :model="queryParams"
        ref="queryForm"
        :inline="true"
    >
      <el-form-item label="测试账号名称" prop="name">
        <el-input
            v-model="queryParams.name"
            placeholder="请输入名称"
            clearable
            size="small"
        />
      </el-form-item>
      <el-form-item>
        <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="handleQuery"
        >搜索</el-button>
      </el-form-item>
    </el-form>
    <el-button icon="el-icon-plus" type="primary" plain size="small" @click="openDialog">添加测试账号</el-button>
    <el-button
        type="success"
        plain size="small"
        icon="el-icon-download"
        @click="importEvent"
    >导入</el-button>
    <el-button
        v-loading="addLoading"
        type="info"
        plain size="small"
        icon="el-icon-upload2"
        @click="exportEvent"
    >导出</el-button>
    <el-table :data="moreArr" style="margin-top: 15px" v-loading="loading">
      <el-table-column label="编号" align="center" width="100" prop="id" />
      <el-table-column label="测试账号名称" align="center" prop="name" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="更新时间" align="center" prop="updateTime" />
      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column label="操作" align="center" >
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.page"
        :limit.sync="queryParams.size"
        @pagination="getTests"
    />

    <el-dialog title="操作框" :visible.sync="dialogVisible" width="40%">
      <el-form class="demo-form-inline" label-width="100px" :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="账号名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入测试账号名称" />
        </el-form-item>
        <el-form-item label="备注说明">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button :type="form.id ? 'warning' : 'primary'" @click="affirm">{{
          form.id ? "确认修改" : "确认添加"
        }}</el-button>
      </div>
    </el-dialog>
    <handleImport ref="handleImport" url="/tests/importTests" @importRes="importRes" @downloadTemplate="downloadTemplate"></handleImport>
  </div>
</template>
<script>
import { addTests, getTests, upTests, delTests ,downloadTemplate,exportTest} from "@/api/tests";
import handleImport from "@/components/handleImport";
export default {
  name:"TestMore",
  data () {
    return {
      queryParams:{
        page:1,
        size:10
      },
      total:0,
      loading:false,
      addLoading:false,
      moreArr: [],
      dialogVisible: false,
      form: {
        name: "",
        remark: ""
      },
      search: "",
      rules: {
        name: [
          { required: true, message: '请输入测试账号名称', trigger: 'blur' }
        ]
      },
    }
  },
  created () {
    this.getTests();
  },
  methods: {
    async getTests () {
      this.loading=true;
      let {data,total} = await getTests(this.queryParams);
      this.loading=false;
      this.moreArr = data;this.total=total;
    },
    handleQuery(){
      this.queryParams.page=1;
      this.getTests();
    },
    async affirm () {
      this.$refs['ruleForm'].validate(async (valid) => {
        if (!valid) return;
        try {
          this.addLoading=true;
          !this.form.id&& await addTests(this.form);
          this.form.id&&await upTests({ ...this.form });
          this.addLoading=false;
          this.$message.success(this.form.id?"修改成功！":"添加成功！")
          this.getTests();
          this.dialogVisible = false;
        }catch (e) {
          this.addLoading=false;
        }
      });
    },
    openDialog () {
      this.form = {};
      this.dialogVisible = true;
    },
    handleEdit (i, row) {
      this.form={...row};
      this.dialogVisible = true;
    },
    handleDelete (index, row) {
      this.$confirm('此操作将永久删除该测试账号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(async () => {
        await delTests({ id: row.id });
        this.getTests();
        this.$message({
          message: '删除成功！',
          type: 'success'
        });
      })
    },
    importEvent(){
      this.$refs.handleImport.show();
    },
    async exportEvent(){
      try {
        this.addLoading=true;
        let res=await exportTest(this.queryParams);
        this.addLoading=false;
        this.$downFile(res);
      }catch (e) {
        this.addLoading=false;
      }
    },
    importRes(){
      this.$message.success("导入成功！");
      this.getTests();
    },
    async downloadTemplate({call}){
      let res=await downloadTemplate();
      this.$downFile(res);
      call();
    }
  },
  components:{
    handleImport
  }
}
</script>
<style lang="scss" scoped>
.boxs {
  padding: 20px;
}
</style>
