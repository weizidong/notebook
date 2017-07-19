<template>
  <div class="page">
    <div class="search">
      <el-input placeholder="项目名称..." v-model="page.filter.name">
        <template slot="prepend">项目名称：</template>
      </el-input>
      <el-input placeholder="项目负责人..." v-model="page.filter.principal">
        <template slot="prepend">项目负责人：</template>
      </el-input>
      <el-date-picker v-model="page.date" type="daterange" range-separator=" 至 " placeholder="项目开始时间..."/>
      <el-button type="primary" icon="search" @click="findList">搜索</el-button>
    </div>
    <el-table :data="list" border>
      <el-table-column prop="name" label="项目名称" min-width="150"/>
      <el-table-column prop="principal" label="项目负责人" min-width="120"/>
      <el-table-column prop="startTime" label="开始时间" :formatter="timeFilter" min-width="120"/>
      <el-table-column prop="amount" label="项目金额" :formatter="({amount})=>'￥'+amount" min-width="120"/>
      <el-table-column prop="receipt" label="已收金额" :formatter="({receipt})=>'￥'+receipt" min-width="120"/>
      <el-table-column prop="arrears" label="未收金额" :formatter="({amount,receipt})=>'￥'+(amount-receipt)" min-width="120"/>
      <el-table-column prop="outlay" label="支出" :formatter="({outlay})=>'￥'+outlay" min-width="120"/>
      <el-table-column prop="profit" label="利润" :formatter="({outlay,receipt})=>'￥'+(receipt-outlay)" min-width="120"/>
      <el-table-column fixed="right" label="操作" width="200">
        <template scope="scope">
          <el-button @click="$router.push({path: '/info/'+scope.row.id})" type="text" size="small">详情</el-button>
          <el-button @click="handleInput('receipt',scope.row)" v-if="scope.row.type == 1" type="text" size="small">收入</el-button>
          <el-button @click="handleInput('outlay',scope.row)" v-if="scope.row.type == 1" type="text" size="small">支出</el-button>
          <el-button @click="handleChange('type',2,scope.row)" v-if="scope.row.type == 1" type="text" size="small">完结</el-button>
          <el-button @click="handleChange('del',1,scope.row)" v-if="scope.row.type == 2" type="text" style="color: red" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="my-pagination">
      <el-pagination @size-change="sizeChange" @current-change="pageChange" :current-page="page.page" :page-sizes="[10, 30, 50, 100]" :page-size="page.size" layout="total, sizes, prev, pager, next, jumper" :total="page.all"/>
    </div>
  </div>
</template>

<script>
  import {projectDB} from '../db'
  import moment from 'moment'
  export default {
    data () {
      return {
        list: [],
        page: {filter: {},date:[], page: 1, size: 20, all: 0}
      }
    },
    components: {},
    methods: {
      timeFilter ({startTime}) {
        return moment(startTime).format('YYYY-MM-DD')
      },
      pageChange(page){
        this.page.page = page
        this.findList()
      },
      sizeChange(size){
        this.page.size = size
        this.findList()
      },
      findList () {
        this.page.all = projectDB.size().value();
        this.list = projectDB.value();
        console.log(this.page)
        console.log(this.list)
      },
      handleInput (filed,{id}) {
        this.$prompt(`请输入${filed==='receipt'?'收入':'支出'}金额：`, filed==='receipt'?'收入':'支出', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^\d+$/,
          inputErrorMessage: '请输入金额...'
        }).then(({value}) => {
          projectDB.getById(id).assign({[filed]:value}).write()
          this.findList()
        })
      },
      handleChange (filed,value,{id,name}) {
        this.$confirm(`确认${filed==='del'?'删除':'完结'}项目【${project.name}】？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            if(filed === 'del'){
              projectDB.remove({name:project.name}).write()
            }else{
              projectDB.getById(id).assign({[filed]:value}).write()
            }
          this.findList()
        })
      },
    },
    beforeRouteUpdate (to, from, next) {
      next()
      this.page = {filter: {},date:[], page: 1, size: 20, all: 0}
      this.findList()
    },
    created () {
      this.findList();
    }
  }
</script>

<style>
  .search{
    text-align:left;padding:5px;
    .el-input-group{
      width: 200px;
      .el-input-group__prepend{color: #111}
    }
  }
  .my-pagination{padding: 5px;text-align: center}
  .el-table {
    width: 100%;
    th,td {text-align: center !important;}
  }
</style>
