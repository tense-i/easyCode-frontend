<template>
  <!-- 导入表 -->
  <el-dialog
    title="导入表"
    v-model="visible"
    width="800px"
    top="5vh"
    append-to-body
  >
    <el-tabs type="border-card">
      <el-tab-pane label="导入建表语句">
        <el-text size="large">
          请输入建表 SQL 语句：
          <el-button round @click="handleExampleSQL(true)">导入示例</el-button>
          <el-select
            v-model="dbType"
            filterable
            placeholder="数据库类型"
            style="width: 240px"
          >
            <el-option
              v-for="item in dbTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-text>
        <div style="margin: 20px 0" />
        <el-input
          v-model="sqlarea"
          :rows="15"
          type="textarea"
          placeholder="Please input"
        />
        <div style="margin: 20px 0" />

        <el-row class="mb-4">
          <el-button type="primary" @click="handleGetGenTableBySql"
            >导入</el-button
          >
          <el-button @click="handleExampleSQL(false)">重置</el-button>
        </el-row>
      </el-tab-pane>

      <el-tab-pane label="ruoyi">
        <el-form :model="queryParams" ref="queryRef" :inline="true">
          <el-form-item label="表名称" prop="tableName">
            <el-input
              v-model="queryParams.tableName"
              placeholder="请输入表名称"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>

          <el-form-item label="表描述" prop="tableComment">
            <el-input
              v-model="queryParams.tableComment"
              placeholder="请输入表描述"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery"
              >搜索</el-button
            >
            <!--                        <el-button icon="Refresh" @click="resetQuery">重置</el-button>-->
            <el-button type="primary" @click="handleImportTable"
              >导入</el-button
            >
          </el-form-item>
        </el-form>
        <el-row>
          <el-table
            @row-click="clickRow"
            ref="table"
            :data="dbTableList"
            @selection-change="handleSelectionChange"
            height="260px"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column
              prop="tableName"
              label="表名称"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column
              prop="tableComment"
              label="表描述"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column
              prop="createTime"
              label="创建时间"
            ></el-table-column>
            <el-table-column
              prop="updateTime"
              label="更新时间"
            ></el-table-column>
          </el-table>
          <pagination
            v-show="total > 0"
            :total="total"
            v-model:page="queryParams.current"
            v-model:limit="queryParams.pageSize"
            @pagination="getList"
          />
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleImportTable">确 定</el-button>
        <el-button @click="visible = false">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import {
  generateBySchemaV2,
  getGenTableBySql,
  getSchemaBySql,
  listDbTable,
} from "@/api/tool/gen";
import { pageGenTable } from "@/api/system/genTableColumn.js";

const total = ref(0);
const visible = ref(false);
const tables = ref([]);
const dbTableList = ref([]);

const { proxy } = getCurrentInstance();

const dbTypeOptions = [
  {
    value: "MySQL",
    label: "MySQL",
  },
  {
    value: "PostgreSQL",
    label: "PostgreSQL",
  },
];

const queryParams = reactive({
  current: 1,
  pageSize: 10,
  tableName: undefined,
  tableComment: undefined,
});

const data = reactive({
  sqlarea: "",
  dbType: "MySQL",
});

const { sqlarea, dbType } = toRefs(data);

const emit = defineEmits(["ok"]);

/* 父组件方法 设置 tableSchemaList*/
const setData = inject("setData");
const addData = inject("addData");
const addDataArray = inject("addDataArray");

/** 查询参数列表 */
function show() {
  getList();
  visible.value = true;
}

/** 单击选择行 */
function clickRow(row) {
  // debgger
  proxy.$refs.table.toggleRowSelection(row);
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  tables.value = selection;
}

/** 查询表数据 */
function getList() {
  pageGenTable(queryParams).then((res) => {
    dbTableList.value = res.data.records;
    total.value = res.data.total;
  });
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.current = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

/** 导入按钮操作 */
function handleImportTable() {
  const value = tables.value;
  if (value == null && value.length === 0) {
    proxy.$modal.msgError("请选择要导入的表");
    return;
  }
  addDataArray(value);
}

/** 导入示例按钮操作 */
function handleExampleSQL(flag) {
  if (flag) {
    data.sqlarea =
      "CREATE TABLE `user_info` (\n  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',\n  `user_name` varchar(256) DEFAULT NULL COMMENT '用户昵称',\n  `user_account` varchar(256) NOT NULL COMMENT '账号',\n  `user_avatar` varchar(1024) DEFAULT NULL COMMENT '用户头像',\n  `gender` tinyint(4) DEFAULT NULL COMMENT '性别',\n  `user_role` varchar(256) NOT NULL DEFAULT 'user' COMMENT '用户角色：user/ admin',\n  `user_password` varchar(512) NOT NULL COMMENT '密码',\n  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',\n  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',\n  `is_delete` tinyint(4) NOT NULL DEFAULT '0' COMMENT '是否删除',\n  PRIMARY KEY (`id`) USING BTREE,\n  UNIQUE KEY `uni_userAccount` (`user_account`) USING BTREE\n) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户';";
  }

  if (!flag) {
    data.sqlarea = null;
  }
}

/** 导入按钮操作 */
function handleGetGenTableBySql() {
  const data = {
    sql: sqlarea.value,
    type: dbType.value,
  };
  getGenTableBySql(data).then((res) => {
    addData(res.data);
  });
}

defineExpose({
  show,
});
</script>
