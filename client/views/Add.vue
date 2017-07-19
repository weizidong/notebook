<template>
  <div class="page">
    <div class="title">新增项目</div>
    <el-form :model="project" :rules="rules" ref="project" label-width="120px">
      <el-form-item label="项目名称：" prop="name">
        <el-input v-model="project.name"/>
      </el-form-item>
      <el-form-item label="项目负责人：" prop="principal">
        <el-input v-model="project.principal"/>
      </el-form-item>
      <el-form-item label="开始时间：" prop="startTime">
        <el-date-picker type="date" placeholder="选择日期" v-model="project.startTime"/>
      </el-form-item>
      <el-form-item label="项目金额：" prop="amount">
        <el-input v-model="project.amount">
          <template slot="append">￥</template>
        </el-input>
      </el-form-item>
      <el-form-item label="项目文档：" prop="files">
        <el-upload class="my-upload" action="/" :on-remove="handleRemove" :http-request="handleRequest" :file-list="project.files">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        </el-upload>
      </el-form-item>
      <div style="text-align: center">
        <el-button type="primary" @click="submitForm('project')">新增</el-button>
        <el-button @click="resetForm('project')">重置</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
  import moment from 'moment'
  import {writeFile} from '../utils'
  import {projectDB} from '../db'
  const def = {name: '', principal: '', startTime: '', amount: '', files: [], receipt: 0, type: 1, outlay: 0,del:0};
  export default {
    data() {
      return {
        project: {...def},
        rules: {
          name: [{required: true, message: '请输入项目名称...', trigger: 'blur'}],
          principal: [{required: true, message: '请输入项目负责人...', trigger: 'blur'}],
          startTime: [{type:'date',required: true, message: '请选择开始时间...', trigger: 'change'}],
          amount: [{required: true, message: '请输入项目金额...', trigger: 'blur'}]
        }
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            projectDB.insert(this.project).write()
            this.$alert(`项目【${this.project.name}】已经添加成功！`, '提示', {
              confirmButtonText: '确定',
              type: 'success'
            }).then(() => this.project = {...def,files: []})
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      handleRemove(file, fileList) {
        this.project.files = fileList
      },
      handleRequest({file, onSuccess}){
        const url = `./file/${moment().format('YYYY-MM-DD')}/${file.name}`;
        writeFile(file.path, url)
        const res = {name: file.name, url}
        onSuccess(res)
        this.project.files.push(res)
      }
    }
  }
</script>

<style>
  .title {text-align: center;padding: 2rem;}
</style>
