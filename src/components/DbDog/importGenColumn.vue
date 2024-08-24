<template>
  <!-- 导入字段 -->

  <el-drawer
    v-if="witch === 'drawer'"
    :size="'45%'"
    title="导入字段"
    v-model="visible"
  >
    <el-tabs type="border-card">
      <el-tab-pane v-if="0 !== (showTab & 1)" label="SQL">
        <el-space :size="20" wrap>
          <el-select v-model="sql.type" filterable placeholder="数据库类型">
            <el-option
              v-for="item in dbTypeOptions"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
          <el-button round @click="handleExampleSQL()">导入示例</el-button>
          <el-button type="primary" @click="importSqlEmits">导入</el-button>
          <el-button @click="resetSQL">重置</el-button>
        </el-space>
        <div style="margin: 10px 0" />
        <el-input
          v-model="sql.sql"
          :rows="15"
          type="textarea"
          placeholder="请输入建表 SQL 语句"
        />
      </el-tab-pane>

      <el-tab-pane v-if="0 !== (showTab & 2)" label="生成表-字段">
        <el-form
          :model="queryGenTableColumnParams"
          ref="queryGenTableRef"
          :inline="true"
        >
          <el-row :gutter="10">
            <el-col :span="7">
              <el-form-item label="字段归属表" prop="tableIds">
                <el-select
                  v-model="queryGenTableColumnParams.tableIds"
                  @change="doPageGenTableColumn"
                  multiple
                  clearable
                  placeholder="请选择字段归属表"
                >
                  <el-option
                    v-for="item in listGenTableData"
                    :key="item.tableId"
                    :label="item.tableName"
                    :value="item.tableId"
                  >
                    <span style="float: left">{{ item.tableName }}</span>
                    <span
                      style="
                        float: right;
                        color: var(--el-text-color-secondary);
                        font-size: 13px;
                      "
                    >
                      {{ item.tableComment }}
                    </span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="关键词" prop="searchValue">
                <el-input
                  v-model="queryGenTableColumnParams.searchValue"
                  placeholder="请输入关键词"
                  clearable
                  @keyup.enter="doPageGenTableColumn"
                />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item>
                <el-button
                  type="primary"
                  icon="Search"
                  @click="doPageGenTableColumn"
                  >搜索</el-button
                >
                <el-button type="primary" @click="importGenTableColumnEmit"
                  >导入</el-button
                >
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <trends-table
          :max-height="300"
          :columns="listGenTableColumnData"
          :show-columns="showColumnsGenColumn"
          :selection="true"
          :index="true"
          @selection-change="selectionChangeGenTable"
        >
        </trends-table>

        <pagination
          v-show="queryGenTableColumnParams.total > 0"
          :total="queryGenTableColumnParams.total"
          v-model:page="queryGenTableColumnParams.current"
          v-model:limit="queryGenTableColumnParams.pageSize"
          @pagination="doPageGenTableColumn"
        />
      </el-tab-pane>

      <el-tab-pane v-if="0 !== (showTab & 4)" label="数据源">
        <el-space :size="10" spacer="">
          <el-select
            v-model="selectDataSourceModelName"
            @change="changeListDynamicDatabase"
            placeholder="请选择数据源"
          >
            <el-option
              v-for="item in listDataSourceModelData"
              :key="item.connectionName"
              :label="item.connectionName"
              :value="item.connectionName"
              @click=""
            >
            </el-option>
          </el-select>

          <el-select
            v-model="selectDynamicDatabaseName"
            @change="changeListDynamicTable"
            placeholder="请选择数据库"
          >
            <el-option
              v-for="item in listDynamicDatabaseData"
              :key="item.databaseName"
              :label="item.databaseName"
              :value="item.databaseName"
              @click=""
            >
            </el-option>
          </el-select>

          <el-select
            v-model="selectDynamicTableNames"
            @change="changeListDynamicColumn"
            multiple
            clearable
            placeholder="请选择字段归属表"
          >
            <el-option
              v-for="item in listDynamicTableData"
              :key="item.tableName"
              :label="item.tableName"
              :value="item.tableName"
            >
              <span style="float: left">{{ item.tableName }}</span>
              <span
                style="
                  float: right;
                  color: var(--el-text-color-secondary);
                  font-size: 13px;
                "
              >
                {{ item.tableComment }}
              </span>
            </el-option>
          </el-select>

          <el-button type="primary" @click="importDynamicColumnEmits"
            >导入
          </el-button>
        </el-space>
        <div style="margin: 20px 0"></div>

        <trends-table
          ref="importDynamicColumn"
          :max-height="300"
          :columns="listDynamicColumnData"
          :show-columns="showColumnsGenColumn"
          :selection="true"
          :index="true"
          @selection-change="selectionChangeTable"
        >
        </trends-table>

        <!--                <trends-table-test ref="importDynamicColumnTest"-->
        <!--                              :columns="listDynamicTableData"-->
        <!--                              :show-columns="showColumnsGenColumn"-->
        <!--                              :selection="true">-->

        <!--                </trends-table-test>-->
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
  <el-dialog
    v-if="witch === 'dialog'"
    title="导入字段"
    v-model="visible"
    width="800px"
    top="1vh"
    append-to-body
    draggable
  >
    <el-tabs type="border-card">
      <el-tab-pane v-if="0 !== (showTab & 1)" label="SQL">
        <el-space :size="20" wrap>
          <el-select v-model="sql.type" filterable placeholder="数据库类型">
            <el-option
              v-for="item in dbTypeOptions"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
          <el-button round @click="handleExampleSQL()">导入示例</el-button>
          <el-button type="primary" @click="importSqlEmits">导入</el-button>
          <el-button @click="resetSQL">重置</el-button>
        </el-space>
        <div style="margin: 10px 0" />
        <el-input
          v-model="sql.sql"
          :rows="15"
          type="textarea"
          placeholder="请输入建表 SQL 语句"
        />
      </el-tab-pane>

      <el-tab-pane v-if="0 !== (showTab & 2)" label="生成表-字段">
        <el-form
          :model="queryGenTableColumnParams"
          ref="queryGenTableRef"
          :inline="true"
        >
          <el-row :gutter="10">
            <el-col :span="7">
              <el-form-item label="字段归属表" prop="tableIds">
                <el-select
                  v-model="queryGenTableColumnParams.tableIds"
                  @change="doPageGenTableColumn"
                  multiple
                  clearable
                  placeholder="请选择字段归属表"
                >
                  <el-option
                    v-for="item in listGenTableData"
                    :key="item.tableId"
                    :label="item.tableName"
                    :value="item.tableId"
                  >
                    <span style="float: left">{{ item.tableName }}</span>
                    <span
                      style="
                        float: right;
                        color: var(--el-text-color-secondary);
                        font-size: 13px;
                      "
                    >
                      {{ item.tableComment }}
                    </span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="关键词" prop="searchValue">
                <el-input
                  v-model="queryGenTableColumnParams.searchValue"
                  placeholder="请输入关键词"
                  clearable
                  @keyup.enter="doPageGenTableColumn"
                />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item>
                <el-button
                  type="primary"
                  icon="Search"
                  @click="doPageGenTableColumn"
                  >搜索</el-button
                >
                <el-button type="primary" @click="importGenTableColumnEmit"
                  >导入</el-button
                >
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <trends-table
          :max-height="300"
          :columns="listGenTableColumnData"
          :show-columns="showColumnsGenColumn"
          :selection="true"
          :index="true"
          @selection-change="selectionChangeGenTable"
        >
        </trends-table>

        <pagination
          v-show="queryGenTableColumnParams.total > 0"
          :total="queryGenTableColumnParams.total"
          v-model:page="queryGenTableColumnParams.current"
          v-model:limit="queryGenTableColumnParams.pageSize"
          @pagination="doPageGenTableColumn"
        />
      </el-tab-pane>

      <el-tab-pane v-if="0 !== (showTab & 4)" label="数据源">
        <el-space :size="10" spacer="">
          <el-select
            v-model="selectDataSourceModelName"
            @change="changeListDynamicDatabase"
            placeholder="请选择数据源"
          >
            <el-option
              v-for="item in listDataSourceModelData"
              :key="item.connectionName"
              :label="item.connectionName"
              :value="item.connectionName"
              @click=""
            >
            </el-option>
          </el-select>

          <el-select
            v-model="selectDynamicDatabaseName"
            @change="changeListDynamicTable"
            placeholder="请选择数据库"
          >
            <el-option
              v-for="item in listDynamicDatabaseData"
              :key="item.databaseName"
              :label="item.databaseName"
              :value="item.databaseName"
              @click=""
            >
            </el-option>
          </el-select>

          <el-select
            v-model="selectDynamicTableNames"
            @change="changeListDynamicColumn"
            multiple
            clearable
            placeholder="请选择字段归属表"
          >
            <el-option
              v-for="item in listDynamicTableData"
              :key="item.tableName"
              :label="item.tableName"
              :value="item.tableName"
            >
              <span style="float: left">{{ item.tableName }}</span>
              <span
                style="
                  float: right;
                  color: var(--el-text-color-secondary);
                  font-size: 13px;
                "
              >
                {{ item.tableComment }}
              </span>
            </el-option>
          </el-select>

          <el-button type="primary" @click="importDynamicColumnEmits"
            >导入
          </el-button>
        </el-space>
        <div style="margin: 20px 0"></div>

        <trends-table
          ref="importDynamicColumn"
          :max-height="300"
          :columns="listDynamicColumnData"
          :show-columns="showColumnsGenColumn"
          :selection="true"
          :index="true"
          @selection-change="selectionChangeTable"
        >
        </trends-table>

        <!--                <trends-table-test ref="importDynamicColumnTest"-->
        <!--                              :columns="listDynamicTableData"-->
        <!--                              :show-columns="showColumnsGenColumn"-->
        <!--                              :selection="true">-->

        <!--                </trends-table-test>-->
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script setup>
import { listDbTable, importTable, getGenTableBySql } from "@/api/tool/gen";
import { listDataSourceModel } from "@/api/system/dataSourceModel.js";
import {
  listDynamicDatabase,
  listDynamicTable,
} from "@/api/system/dynamicData.js";
import trendsTable from "@/components/DbDog/trendsTable.vue";
import TrendsTable from "@/components/DbDog/trendsTable.vue";
import TrendsTableTest from "@/components/DbDog/trendsTableTest.vue";
import {
  dynamicTableConvertGenTable,
  listGenTable,
} from "@/api/system/genTable.js";
import {
  listDynamicColumn,
  listTableInfo,
  pageGenTable,
  pageGenTableColumn,
} from "@/api/system/genTableColumn.js";
import { defineProps, watch } from "vue";

// 常量

const dbTypeOptions = {
  MySQL: {
    name: "MySQL",
    sql: "CREATE TABLE `user_info` (\n  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',\n  `user_name` varchar(256) DEFAULT NULL COMMENT '用户昵称',\n  `user_account` varchar(256) NOT NULL COMMENT '账号',\n  `user_avatar` varchar(1024) DEFAULT NULL COMMENT '用户头像',\n  `gender` tinyint(4) DEFAULT NULL COMMENT '性别',\n  `user_role` varchar(256) NOT NULL DEFAULT 'user' COMMENT '用户角色：user/ admin',\n  `user_password` varchar(512) NOT NULL COMMENT '密码',\n  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',\n  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',\n  `is_delete` tinyint(4) NOT NULL DEFAULT '0' COMMENT '是否删除',\n  PRIMARY KEY (`id`) USING BTREE,\n  UNIQUE KEY `uni_userAccount` (`user_account`) USING BTREE\n) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户';",
  },
  PostgreSQL: {
    name: "PostgreSQL",
    sql: "CREATE TABLE `user_info` (\n  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',\n  `user_name` varchar(256) DEFAULT NULL COMMENT '用户昵称',\n  `user_account` varchar(256) NOT NULL COMMENT '账号',\n  `user_avatar` varchar(1024) DEFAULT NULL COMMENT '用户头像',\n  `gender` tinyint(4) DEFAULT NULL COMMENT '性别',\n  `user_role` varchar(256) NOT NULL DEFAULT 'user' COMMENT '用户角色：user/ admin',\n  `user_password` varchar(512) NOT NULL COMMENT '密码',\n  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',\n  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',\n  `is_delete` tinyint(4) NOT NULL DEFAULT '0' COMMENT '是否删除',\n  PRIMARY KEY (`id`) USING BTREE,\n  UNIQUE KEY `uni_userAccount` (`user_account`) USING BTREE\n) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户';",
  },
};

const showColumnsGenColumn = ref([
  {
    label: "字段列名",
    type: "",
    key: "columnName",
  },
  {
    label: "字段描述",
    type: "",
    key: "columnComment",
  },
  {
    label: "物理类型",
    type: "",
    key: "columnType",
  },
  {
    label: "默认值",
    type: "",
    key: "defaultValue",
  },
  {
    label: "主键",
    key: "isPk",
    type: "or",
    or: {
      true: "1",
      false: "0",
    },
  },
  {
    label: "自增",
    key: "isIncrement",
    type: "or",
    or: {
      true: "1",
      false: "0",
    },
  },
  {
    label: "必填",
    key: "isRequired",
    type: "or",
    or: {
      true: "1",
      false: "0",
    },
  },
]);

const total = ref(0);
const visible = ref(false);
const tables = ref([]);

const { proxy } = getCurrentInstance();

const queryGenTableParams = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
  searchValue: "",
  tableName: undefined,
  tableComment: undefined,
});

const queryGenTableColumnParams = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  searchValue: "",
  columnName: undefined,
  columnComment: undefined,
  tableIds: undefined,
});

const sql = reactive({
  type: "MySQL",
  sql: null,
});

const selectionTable = ref([]);
const selectionGenTableRows = ref([]);

const dynamicDataQueryParams = reactive({
  connectionName: null,
  databaseName: null,
});

const listDataSourceModelData = ref([]);

const selectDataSourceModelName = ref("");

const listDynamicDatabaseData = ref([]);

const selectDynamicDatabaseName = ref("");

const listDynamicTableData = ref([]);

const selectDynamicTableNames = ref([]);

const listDynamicColumnData = ref([]);

const listGenTableData = ref([]);

const listGenTableColumnData = ref([]);

const { showTab } = defineProps({
  showTab: {
    type: Number,
    default: 7,
  },
  witch: {
    type: String,
    default: "dialog",
  },
});

watch(
  () => showTab,
  (newValue) => {
    emit("update:showTab", newValue);
  }
);

// 导入genTables事件 返回genTables
// 导入sql事件 返回genTable
let $emit = defineEmits([
  "importSql",
  "importDynamicColumn",
  "importGenTableColumn",
]);

/*建表语句*/

const importSqlEmits = () => {
  const queryData = {
    sql: sql.sql,
    type: sql.type,
  };
  getGenTableBySql(queryData).then((res) => {
    if (res.code === 200) {
      $emit("importSql", res.data);
    }
  });
};

/** 导入示例按钮操作 */
function handleExampleSQL() {
  sql.sql = dbTypeOptions[sql.type].sql;
}

// 重置SQL
function resetSQL() {
  sql.sql = null;
}

/*建表语句*/

/*数据源导入*/

// 查看数据源
function doListDataSourceModel() {
  listDataSourceModel({}).then((res) => {
    if (res.code === 200) {
      listDataSourceModelData.value = res.data;
    }
  });
}

// 查看数据库
function changeListDynamicDatabase() {
  let dataSourceModelName = selectDataSourceModelName.value;
  // 使用 find 方法找到元素
  const dataSourceModel = listDataSourceModelData.value.find(
    (element) => element.connectionName === dataSourceModelName
  );
  listDynamicDatabase(dataSourceModel, {}).then((res) => {
    if (res.code === 200) {
      listDynamicDatabaseData.value = res.data;
      selectDynamicDatabaseName.value = "";
      listDynamicTableData.value = [];
      listDynamicColumnData.value = [];
      selectDynamicTableNames.value = "";
    }
  });
}

// 查看表
function changeListDynamicTable() {
  let dataSourceModelName = selectDataSourceModelName.value;
  // 使用 find 方法找到元素
  const dataSourceModel = listDataSourceModelData.value.find(
    (element) => element.connectionName === dataSourceModelName
  );
  dataSourceModel.databaseName = selectDynamicDatabaseName.value;
  listDynamicTable(dataSourceModel, { isChild: true }).then((res) => {
    if (res.code === 200) {
      listDynamicTableData.value = res.data;
      listDynamicColumnData.value = [];
      selectDynamicTableNames.value = "";
    }
  });
}

function changeListDynamicColumn() {
  // debgger
  let dataSourceModelName = selectDataSourceModelName.value;
  // 使用 find 方法找到元素
  const dataSourceModel = listDataSourceModelData.value.find(
    (element) => element.connectionName === dataSourceModelName
  );
  dataSourceModel.databaseName = selectDynamicDatabaseName.value;
  let tableNames = selectDynamicTableNames.value;
  if (!tableNames) {
    tableNames = [];
  }
  listDynamicColumnData.value = [];
  for (let i = 0; i < tableNames.length; i++) {
    listDynamicColumn(dataSourceModel, { tableName: tableNames[i] }).then(
      (res) => {
        if (res.code === 200) {
          listDynamicColumnData.value.push(...res.data);
        }
      }
    );
  }
}

// 动态表选中
function selectionChangeTable(rows) {
  selectionTable.value = rows;
}

// 导入动态表
const importDynamicColumnEmits = () => {
  // debgger
  // let multipleSelection = proxy.$refs["importDynamicColumn"].multipleSelection;
  dynamicTableConvertGenTable(selectionTable.value).then((res) => {
    if (res.code === 200) {
      $emit("importDynamicColumn", res.data);
      proxy.$modal.msgSuccess("数据源-导入字段");
    }
  });
};

/*数据源导入*/

/*生成表导入*/

// 查询生成表
function doListGenTable() {
  listGenTable().then((res) => {
    listGenTableData.value = res.data;
  });
}

// 查询字段
function doPageGenTableColumn() {
  let searchValue = queryGenTableColumnParams.value.searchValue;
  queryGenTableColumnParams.value.columnName = searchValue;
  queryGenTableColumnParams.value.columnComment = searchValue;
  pageGenTableColumn(queryGenTableColumnParams.value).then((res) => {
    listGenTableColumnData.value = res.data.records;
    queryGenTableColumnParams.value.total = Number(res.data.total);
  });
}

// 生成表选中
function selectionChangeGenTable(rows) {
  selectionGenTableRows.value = rows;
}

// 导入
function importGenTableColumnEmit() {
  // debgger
  let genTables = selectionGenTableRows.value;
  if (genTables.length === 0) {
    proxy.$modal.msgError("请选择要导入的表");
    return;
  }

  $emit("importGenTableColumn", genTables);
  proxy.$modal.msgSuccess("生成表-导入字段");
}

/*生成表导入*/

function show() {
  doListDataSourceModel();
  doListGenTable();
  doPageGenTableColumn();
  visible.value = true;
}

/** 单击选择行 */
function clickRow(row) {
  proxy.$refs.table.toggleRowSelection(row);
}

defineExpose({
  show,
});
</script>
