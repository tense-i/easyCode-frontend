<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col span="12">
        <el-button @click="handleGenerateBySchemaV3">SQL数据生成</el-button>
      </el-col>

      <el-col span="12">
        <el-button @click="selectGenConfig">选择代码生成配置</el-button>
        <el-button @click="doPreviewCodeByGenConfigAndGenTables"
          >预览代码</el-button
        >
        <el-button>下载生成代码</el-button>
      </el-col>
    </el-row>

    <!--选择生成配置-->
    <el-dialog v-model="dialogGenConfig" :width="1000" draggable>
      <el-form :model="queryGenConfigParams" v-show="showSearch">
        <el-space>
          <el-form-item label="配置名称" prop="name">
            <el-input
              v-model="queryGenConfigParams.name"
              placeholder="请输入配置名称"
              clearable
              style="width: 200px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="备注" prop="notes">
            <el-input
              v-model="queryGenConfigParams.notes"
              placeholder="请输入备注"
              clearable
              style="width: 200px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="创建时间" style="width: 308px">
            <el-date-picker
              v-model="dateRangeGenConfig"
              value-format="YYYY-MM-DD"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="doPageGenConfig"
              >搜索</el-button
            >
          </el-form-item>
        </el-space>
      </el-form>

      <el-table
        v-loading="loadingGenConfig"
        highlight-current-row
        :data="genConfigs"
        @current-change="handleGenConfig"
      >
        <el-table-column label="序号" type="index" width="50" align="center">
          <template #default="scope">
            <span>{{
              (queryGenConfigParams.pageNum - 1) *
                queryGenConfigParams.pageSize +
              scope.$index +
              1
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="配置名"
          align="center"
          prop="name"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="备注"
          align="center"
          prop="notes"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="生成包路径"
          align="center"
          prop="packagePath"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="生成模块名"
          align="center"
          prop="moduleName"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          width="160"
        />
        <el-table-column
          label="更新时间"
          align="center"
          prop="updateTime"
          width="160"
        />
      </el-table>

      <pagination
        v-show="queryGenConfigParams.total > 0"
        :total="queryGenConfigParams.total"
        v-model:page="queryGenConfigParams.pageNum"
        v-model:limit="queryGenConfigParams.pageSize"
        @pagination="getList"
      />
    </el-dialog>

    <!--  生成按键       -->
    <el-row class="mb-4" style="display: flex; justify-content: space-between">
      <el-text class="mx-1" type="success" size="large">SQL生成器</el-text>
      <el-row class="mb-4" justify="end">
        <el-button type="primary" round @click="handleGenerateBySchemaV3"
          >一键生成</el-button
        >
        <el-button type="success" round>Success</el-button>
        <el-button type="info" round>Info</el-button>
        <el-button type="warning" round>Warning</el-button>
        <el-button type="danger" round>Danger</el-button>
      </el-row>
    </el-row>

    <div style="margin: 20px 0" />

    <!--        待生成表-->
    <trends-table
      :columns="tableSchemaList"
      :show-columns="showColumnsGenTable"
      :index="true"
      :row-key-name="'tableId'"
    >
      <!--            展开-->
      <template v-slot:expandColumn>
        <el-table-column
          label=""
          align="center"
          class-name="small-padding fixed-width"
          type="expand"
        >
          <template #default="scope">
            <div class="centered-96">
              <trends-table
                :columns="scope.row.columns"
                :index="true"
                :show-columns="showColumnsGenColumn"
                :row-key-name="'columnId'"
              >
                <template v-slot:operationsColumn>
                  <el-table-column
                    label="Operate"
                    align="center"
                    class-name="small-padding fixed-width"
                    fixed="right"
                  >
                    <template #default="inscope">
                      <el-button type="primary" link @click="handleSave"
                        >Save</el-button
                      >
                      <el-button
                        type="danger"
                        link
                        @click="
                          handleDeleteColumn(scope.row.columns, inscope.row)
                        "
                      >
                        Delete
                      </el-button>
                    </template>
                  </el-table-column>
                </template>

                <template v-slot:expandColumn>
                  <div style="margin: 8px 0" />
                  <el-table-column
                    label="模拟"
                    align="center"
                    class-name="small-padding fixed-width"
                    type="expand"
                  >
                    <template #default="inscope">
                      <column-from
                        :column="inscope.row"
                        inline="true"
                        :gen-table-list="tableSchemaList"
                      ></column-from>
                    </template>
                  </el-table-column>
                </template>

                <template v-slot:footer>
                  <div style="margin: 15px 15px">
                    <!--       添加字段按键             -->
                    <el-row :gutter="20">
                      <el-col :span="8">
                        <el-button
                          round
                          type="primary"
                          style="width: 100%"
                          @click="handleAddField(scope.row, fieldNew)"
                        >
                          新增字段
                        </el-button>
                      </el-col>
                      <el-col :span="8">
                        <el-button
                          round
                          style="width: 100%"
                          type="primary"
                          @click="handleImportField(scope.row)"
                        >
                          导入字段
                        </el-button>
                      </el-col>
                      <el-col :span="8">
                        <el-button
                          round
                          style="width: 100%"
                          type="primary"
                          @click="
                            handleAddField(
                              scope.row,
                              fieldId,
                              fieldCreateTime,
                              fieldUpdateTime,
                              fieldIsDelete
                            )
                          "
                        >
                          新增通用字段
                        </el-button>
                      </el-col>
                    </el-row>
                  </div>
                </template>
              </trends-table>
            </div>
          </template>
        </el-table-column>
      </template>

      <template v-slot:operationsColumn>
        <el-table-column
          label="Operate"
          align="center"
          class-name="small-padding fixed-width"
          fixed="right"
        >
          <template #default="scope">
            <el-button type="primary" link @click="handleSave">Save</el-button>
            <el-button
              type="danger"
              link
              @click="handleDeleteTable(tableSchemaList, scope.row)"
              >Delete
            </el-button>
          </template>
        </el-table-column>
      </template>

      <template v-slot:footer>
        <div style="margin: 20px 20px">
          <!--        加表按键-->
          <el-row :gutter="20">
            <el-col :span="12">
              <el-button
                round
                style="width: 100%"
                type="success"
                @click="openImportTable"
              >
                导入表
              </el-button>
            </el-col>
            <el-col :span="12">
              <el-button
                round
                style="width: 100%"
                type="success"
                @click="handleAddTableSchema(tableSchemaList, tableSchemaNew)"
              >
                新增表
              </el-button>
            </el-col>
          </el-row>
        </div>
      </template>
    </trends-table>

    <!--        生成数据展示-->
    <el-row :gutter="10">
      <el-col :span="12">
        <template v-if="generateSQL.show">
          <el-tabs
            v-model="generateSQL.tabName1"
            type="border-card"
            default="all"
          >
            <el-tab-pane
              v-for="(item1, key1) in generateSQL.data"
              :key="key1"
              :label="key1"
              :value="key1"
              :name="key1"
            >
              <el-tabs v-model="generateSQL.tabName2" type="border-card">
                <el-tab-pane
                  v-for="(item2, key2) in generateSQL.data[
                    generateSQL.tabName1
                  ]"
                  :label="key2"
                  :name="key2"
                  :key="key2"
                  :value="key2"
                >
                  <el-link
                    :underline="false"
                    icon="DocumentCopy"
                    v-copyText="
                      generateSQL.data[generateSQL.tabName1][
                        generateSQL.tabName2
                      ]
                    "
                    v-copyText:callback="copyTextSuccess"
                    style="float: right"
                    >&nbsp;复制
                  </el-link>
                  <div height="400px">
                    <el-scrollbar>
                      <pre>{{
                        generateSQL.data[generateSQL.tabName1][
                          generateSQL.tabName2
                        ]
                      }}</pre>
                    </el-scrollbar>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-col>
      <el-col :span="12">
        <template v-if="generateSQL.show">
          <el-tabs
            v-model="generateSQL.tabName1"
            type="border-card"
            default="all"
          >
            <el-tab-pane
              v-for="(item1, key1) in generateSQL.data"
              :key="key1"
              :label="key1"
              :value="key1"
              :name="key1"
            >
              <el-tabs v-model="generateSQL.tabName2" type="border-card">
                <el-tab-pane
                  v-for="(item2, key2) in generateSQL.data[
                    generateSQL.tabName1
                  ]"
                  :label="key2"
                  :name="key2"
                  :key="key2"
                  :value="key2"
                >
                  <el-link
                    :underline="false"
                    icon="DocumentCopy"
                    v-copyText="
                      generateSQL.data[generateSQL.tabName1][
                        generateSQL.tabName2
                      ]
                    "
                    v-copyText:callback="copyTextSuccess"
                    style="float: right"
                    >&nbsp;复制
                  </el-link>
                  <div height="400px">
                    <el-scrollbar>
                      <pre>{{
                        generateSQL.data[generateSQL.tabName1][
                          generateSQL.tabName2
                        ]
                      }}</pre>
                    </el-scrollbar>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-col>
    </el-row>

    <!--导入表-->
    <import-gen-table
      ref="importGenTableRef"
      :selection-gen-table-rows="selectionGenTableRows"
      @import-sql="importGenTableBySql"
      @importDynamicTable="importGenTableByDynamicTable"
      @import-gen-table="importGenTableByGenTable"
    >
    </import-gen-table>

    <!--        导入字段-->
    <import-gen-column
      ref="importGenColumnRef"
      :show-tab="3"
      @import-dynamic-column="importGenTableByDynamicTable"
      @import-gen-table-column="importGenTableColumn"
    >
    </import-gen-column>

    <!--   字段保存     -->
    <el-dialog
      v-model="dialogSaveColumn"
      title="Tips"
      width="50%"
      draggable
      overflow
    >
      <columnFrom :column="data.p.pColumn" submit="true"></columnFrom>
    </el-dialog>
  </div>
</template>

<script setup name="Gen">
import {
  listTable,
  previewTable,
  delTable,
  genCode,
  synchDb,
  generateBySchemaV2,
  generateBySchemaV3,
  pageGenConfig,
} from "@/api/tool/gen";
import router from "@/router";
import importTable from "./importTable";
import { isEmpty } from "element-plus/es/utils/index";
import { Calendar, Delete } from "@element-plus/icons-vue";
import { splice } from "@/utils/objectUtils.js";
import {
  pageGenTable,
  pageGenTableColumn,
} from "@/api/system/genTableColumn.js";
import ColumnFrom from "@/components/SqlGen/columnFrom.vue";
import ColumnTable from "@/components/SqlGen/Column/table.vue";
import TableTable from "@/components/SqlGen/Table/table.vue";
import QueryTable from "@/components/SqlGen/Column/queryTable.vue";

import trendsTable from "@/components/DbDog/trendsTable.vue";
import TrendsTable from "@/components/DbDog/trendsTable.vue";
import ImportGenTable from "@/components/DbDog/importGenTable.vue";
import { importGenTables } from "@/api/system/genTable.js";
import ImportTable from "@/views/tool/gentable/importTable.vue";
import ImportGenColumn from "@/components/DbDog/importGenColumn.vue";
import { previewCodeByGenConfigAndGenTables } from "@/api/system/dict/codeGenerator.js";

// 常量
const showColumnsGenTable = ref([
  {
    key: "tableName",
    type: "input",
    label: "表名称",
  },
  {
    key: "tableComment",
    type: "input",
    label: "表注释",
  },
  {
    key: "mockNum",
    type: "input_number",
    label: "模拟条数",
  },
]);

const showColumnsGenColumn = ref([
  {
    label: "字段列名",
    type: "input",
    key: "columnName",
  },
  {
    label: "字段描述",
    type: "input",
    key: "columnComment",
  },
  {
    label: "默认值",
    type: "input",
    key: "defaulValue",
  },
  {
    label: "物理类型",
    type: "input",
    key: "columnType",
  },
  {
    label: "主键",
    key: "isPk",
    type: "check",
    check: {
      true: "1",
      false: "0",
    },
  },
  {
    label: "自增",
    key: "isIncrement",
    type: "check",
    check: {
      true: "1",
      false: "0",
    },
  },
  {
    label: "必填",
    key: "isRequired",
    type: "check",
    check: {
      true: "1",
      false: "0",
    },
  },
]);

// 定义字段对象
class Filed {
  columnId;
  columnName;
  columnComment;
  columnType;
  defaultValue;
  isRequired;
  comment;
  isPk;
  isIncrement;
  mockType;
  mockParams;
  onUpdate;
  mockParam1;
  mockParam2;
  mockParam3;

  constructor(
    columnName,
    columnComment,
    columnType,
    defaultValue,
    isRequired,
    comment,
    isPk,
    isIncrement,
    mockType,
    mockParams,
    onUpdate
  ) {
    this.columnId = null;
    this.columnName = columnName;
    this.columnComment = columnComment;
    this.columnType = columnType;
    this.defaultValue = defaultValue;
    this.isRequired = isRequired;
    this.comment = comment;
    this.isPk = isPk;
    this.isIncrement = isIncrement;
    this.mockType = mockType;
    this.mockParams = mockParams;
    this.onUpdate = onUpdate;
  }
}

// 空字段
const fieldNew = new Filed(
  null,
  null,
  null,
  null,
  "0",
  null,
  "0",
  "0",
  "不模拟",
  "",
  null
);
// 通用字段 - 主键
const fieldId = new Filed(
  "id",
  "主键",
  "bigint(20)",
  null,
  "1",
  "主键",
  "1",
  "0",
  "不模拟",
  "",
  null
);
// 通用字段 - 创建时间
const fieldCreateTime = new Filed(
  "create_time",
  "创建时间",
  "datetime",
  "CURRENT_TIMESTAMP",
  "1",
  "创建时间",
  "0",
  "0",
  "不模拟",
  "",
  null
);
// 通用字段 - 更新时间
const fieldUpdateTime = new Filed(
  "update_time",
  "更新时间",
  "datetime",
  "CURRENT_TIMESTAMP",
  "1",
  "更新时间",
  "0",
  "0",
  "不模拟",
  "",
  null
);
// 通用字段 - 逻辑删除
const fieldIsDelete = new Filed(
  "is_delte",
  "逻辑删除",
  "tinyint",
  0,
  "1",
  "是否逻辑删除 (o-否;1-是 )",
  "0",
  "0",
  "不模拟",
  "",
  null
);

class GenTable {
  tableId;
  dbType;
  dbName;
  tableName;
  tableComment;
  mockNum;
  columns;

  constructor(dbType, dbName, tableName, tableComment, mockNum, columns) {
    this.dbType = dbType;
    this.dbName = dbName;
    this.tableName = tableName;
    this.tableComment = tableComment;
    this.mockNum = mockNum;
    this.columns = columns;
  }
}

// 新增表
const tableSchemaNew = new GenTable("MySQL", null, null, null, 20, []);

const route = useRoute();
const { proxy } = getCurrentInstance();

const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const tableNames = ref([]);
const dateRange = ref([]);
const dateRangeGenConfig = ref([]);
const uniqueId = ref("");
const dialogSaveColumn = ref(false);
const dialogGenConfig = ref(false);
const loadingGenConfig = ref(false);
const selectionGenTableRows = ref([]);

const tabsOptions = {
  show: "insertSql",
  list: [
    {
      tabName: "insertSql",
      valueKey: "insertSql",
    },
    {
      tabName: "createSql",
      valueKey: "createSql",
    },
  ],
};

const data = reactive({
  queryParams: {
    current: 1,
    pageSize: 10,
    searchName: undefined,
  },
  pageGenTableColumnQueryParams: {
    current: 1,
    pageSize: 10,
    searchName: undefined,
  },
  pageGenTableQueryParams: {
    current: 1,
    pageSize: 10,
    searchName: undefined,
  },
  sqlCodeFlag: false,
  sqlCode: {
    all: undefined,
  },
  showTableName: "",
  tableSchemaList: [],
  tableListField: [fieldId, fieldCreateTime, fieldUpdateTime, fieldIsDelete],
  p: {
    pTableSchema: undefined,
    pColumn: undefined,
    genConfig: uniqueId,
  },
  pageGenTableData: {
    records: [],
    total: 0,
  },
  pageGenTableColumnData: {
    records: [],
    total: 0,
  },
  generateSQL: {
    data: [
      {
        tableName: "",
        insertSql: "",
      },
    ],
    tabName1: "",
    tabName2: "",
    show: false,
  },
  queryGenConfigParams: {
    toatal: 0,
    pageNum: 1,
    pageSize: 10,
    name: undefined,
    notes: undefined,
  },
  genConfigs: [],
});

const {
  queryParams,
  pageGenTableColumnQueryParams,
  pageGenTableQueryParams,
  sqlCodeFlag,
  sqlCode,
  showTableName,
  tableSchemaList,
  tableListField,
  p,
  pageGenTableData,
  pageGenTableColumnData,
  generateSQL,
  queryGenConfigParams,
  genConfigs,
} = toRefs(data);

const radiusGroup = ref([
  {
    name: "No Radius",
    type: "",
  },
  {
    name: "Small Radius",
    type: "small",
  },
  {
    name: "Large Radius",
    type: "base",
  },
  {
    name: "Round Radius",
    type: "round",
  },
]);

const getValue = (type) => {
  const getCssVarValue = (prefix, type) =>
    getComputedStyle(document.documentElement).getPropertyValue(
      `--el-${prefix}-${type}`
    );
  return getCssVarValue("border-radius", type);
};

onActivated(() => {
  const time = route.query.t;
  if (time != null && time != uniqueId.value) {
    uniqueId.value = time;
    queryParams.value.current = Number(route.query.pageNum);
    dateRange.value = [];
    proxy.resetForm("queryForm");
    getList();
  }
});

function getList() {
  loading.value = true;
  pageGenTableColumn(
    proxy.addDateRange(queryParams.value, dateRange.value)
  ).then((response) => {
    tableListField.value = response.data.records;
    total.value = response.data.total;
    loading.value = false;
  });
}

function handelPageGenTableColumn() {
  pageGenTableColumn(
    proxy.addDateRange(pageGenTableColumnQueryParams.value, dateRange.value)
  ).then((response) => {
    data.pageGenTableColumnData.records = response.data.records;
    data.pageGenTableColumnData.total = response.data.total;
  });
}

function handlePageGenTable() {
  loading.value = true;
  pageGenTable(
    proxy.addDateRange(pageGenTableQueryParams.value, dateRange.value)
  ).then((response) => {
    data.pageGenTableData.records = response.data.records;
    data.pageGenTableData.total = response.data.total;
  });
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.current = 1;
  getList();
}

/** 生成代码操作 */
function handleGenTable(row) {
  const tbNames = row.tableName || tableNames.value;
  if (tbNames == "") {
    proxy.$modal.msgError("请选择要生成的数据");
    return;
  }
  if (row.genType === "1") {
    genCode(row.tableName).then((response) => {
      proxy.$modal.msgSuccess("成功生成到自定义路径：" + row.genPath);
    });
  } else {
    proxy.$download.zip(
      "/tool/gen/batchGenCode?tables=" + tbNames,
      "ruoyi.zip"
    );
  }
}

/** 同步数据库操作 */
function handleEditColumn(row) {
  dialogSaveColumn.value = true;
  data.p.pColumn = row;
}

/** 同步数据库操作 */
function handleSynchDb(row) {
  const tableName = row.tableName;
  proxy.$modal
    .confirm('确认要强制同步"' + tableName + '"表结构吗？')
    .then(function () {
      return synchDb(tableName);
    })
    .then(() => {
      proxy.$modal.msgSuccess("同步成功");
    })
    .catch(() => {});
}

/** 打开导入表弹窗 */
function openImportTable() {
  proxy.$refs["importGenTableRef"].show();
}

/** 重置按钮操作 */
function resetQuery() {
  dateRange.value = [];
  proxy.resetForm("queryRef");
  handleQuery();
}

/** 预览按钮 */
function handlePreview(row) {
  previewTable(row.tableId).then((response) => {
    preview.value.data = response.data;
    preview.value.open = true;
    preview.value.activeName = "domain.java";
  });
}

/** 复制代码成功 */
function copyTextSuccess() {
  // debgger
  proxy.$modal.msgSuccess("复制成功");
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.tableId);
  tableNames.value = selection.map((item) => item.tableName);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 修改按钮操作 */
function handleEditTable(row) {
  const tableId = row.tableId || ids.value[0];
  router.push({
    path: "/tool/gen-edit/index/" + tableId,
    query: { pageNum: queryParams.value.current },
  });
}

/** 修改按钮操作 */
function handleEditField(row) {
  const tableId = row.tableId || ids.value[0];
  router.push({
    path: "/tool/gen-edit/index/" + tableId,
    query: { pageNum: queryParams.value.current },
  });
}

/** 删除按钮操作 */
function handleDelete(array, index) {
  splice(array, index);
}

/** 导入建表语句按钮操作 */
function handleGetSchemaBySql() {
  importTable({ tables: tableNames }).then((res) => {
    proxy.$modal.msgSuccess(res.msg);
    if (res.code === 200) {
      visible.value = false;
      emit("ok");
    }
  });
}

/** 生成sql代码操作 */
function handleGenerateBySchemaV2() {
  generateBySchemaV2(tableSchemaList.value).then((res) => {
    data.sqlCode = res.data;
    data.sqlCodeFlag = true;
    data.showTableName = "all";
  });
}

/** 生成sql代码操作 */
function handleGenerateBySchemaV3() {
  generateBySchemaV3(tableSchemaList.value).then((res) => {
    data.generateSQL.data = res.data;
    data.generateSQL.show = true;
  });
}

/** 添加字段操作 */

function handleAddField(tableSchema, ...fileds) {
  const copiedFileds = fileds.map((filed) => {
    return JSON.parse(JSON.stringify(filed));
  });

  tableSchema.columns.push(...copiedFileds);
}

/** 删除字段操作 */
function handleDeleteTable(array, row) {
  let pos = array.indexOf(row);
  splice(array, pos);
}

/** 删除字段操作 */
function handleDeleteColumn(columns, row) {
  // debgger
  let pos = columns.indexOf(row);
  splice(columns, pos);
}

/** 导入字段操作 */
function handleImportField(tableSchema) {
  //  修改当前的操作表对象
  data.p.pTableSchema = tableSchema;
  // dialogOverflowVisibleColumn.value = true;
  handlePageGenTable();
  handelPageGenTableColumn();
  proxy.$refs["importGenColumnRef"].show();
}

/** 添加字段操作 */
function handleAddColumns(columns) {
  // debgger
  const copiedColumns = columns.map((filed) =>
    JSON.parse(JSON.stringify(filed))
  );
  check(copiedColumns, "columnId");
  data.p.pTableSchema.columns.push(...copiedColumns);
}

let addNewTableCount = 0;

let counts = {
  tableId: 0,
  columnId: 0,
};
let count = 0;

function check(arr, name) {
  if (!arr) {
    arr = [];
  }

  for (let i = 0; i < arr.length; i++) {
    if (!arr[i][name]) {
      arr[i][name] = --counts[name] + "0"; // 这里赋值为整数型的0
    }
  }

  return arr;
}

/** 添加表操作 */
function handleAddTableSchema(tableSchemaList, ...tableSchemas) {
  // debgger
  // 深拷贝
  const copiedTableSchemas = tableSchemas.map((schema) => {
    check(schema.columns, "columnId");
    return JSON.parse(JSON.stringify(schema));
  });
  check(copiedTableSchemas, "tableId");

  tableSchemaList.push(...copiedTableSchemas);
}

// 导入表 SQL
function importGenTableBySql(genTable) {
  // debgger
  handleAddTableSchema(data.tableSchemaList, genTable);
  // data.tableSchemaList.push(genTable);
}

// 导入表 动态数据源
function importGenTableByDynamicTable(genTables) {
  // debgger
  handleAddTableSchema(data.tableSchemaList, ...genTables);
}

// 导入字段 动态数据源
function importGenColumnByDynamicColumn(dynamicColumns) {
  dynamicColumns;
  handleAddColumns(genTableColumns);
}

// 导入表 生成表
function importGenTableByGenTable(genTables) {
  // debgger
  handleAddTableSchema(data.tableSchemaList, ...genTables);
}

// 导入字段 生成表
function importGenTableColumn(genTableColumns) {
  handleAddColumns(genTableColumns);
}

// 打开选择配置
function selectGenConfig() {
  dialogGenConfig.value = true;
  doPageGenConfig();
}

// 查询配置
function doPageGenConfig() {
  loadingGenConfig.value = true;
  pageGenConfig(
    proxy.addDateRange(data.queryGenConfigParams, dateRangeGenConfig.value)
  ).then((response) => {
    let resData;
    console.log(response.data);
    if (response.hasOwnProperty("data")) {
      resData = response.data;
    } else {
      resData = response;
    }

    // debgger
    data.genConfigs = resData.records;
    data.queryGenConfigParams.total = resData.total;
    loadingGenConfig.value = false;
  });
}

// 选择配置
function handleGenConfig(row) {
  // debgger
  data.p.genConfig = row;
}

// 预览代码
function doPreviewCodeByGenConfigAndGenTables() {
  // debgger
  let queryData = {
    genConfigId: data.p.genConfig.id,
    genTableList: data.tableSchemaList,
  };
  previewCodeByGenConfigAndGenTables(queryData).then((res) => {
    console.log(res);
  });
}

provide("setData", (newData) => {
  data.tableSchemaList = newData;
});

provide("addData", (newData) => {
  data.tableSchemaList.push(newData);
});

provide("addDataArray", (newData) => {
  data.tableSchemaList.push(...newData);
});

getList();
</script>

<style setup>
.my-4 {
  margin-top: 20px;
  margin-bottom: 20px;
}

.demo-radius .title {
  color: var(--el-text-color-regular);
  font-size: 18px;
  margin: 10px 0;
}

.demo-radius .value {
  color: var(--el-text-color-primary);
  font-size: 16px;
  margin: 10px 0;
}

.demo-radius .radius {
  height: 40px;
  width: 70%;
  border: 1px solid var(--el-border-color);
  border-radius: 0;
  margin-top: 20px;
}

.custom-button {
  width: 80%; /* 设置为父元素宽度的 4/5，假设父元素宽度为 100% */
  text-align: center; /* 文本居中 */
}

.centered-96 {
  width: 96%;
  margin: 0 auto;
}

.centered-90 {
  width: 90%;
  margin: 0 auto;
}

.centered-70 {
  width: 70%;
  margin: 0 auto;
}
</style>
