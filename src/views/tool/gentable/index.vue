<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="表名称" prop="tableName">
        <el-input
          v-model="queryParams.tableName"
          placeholder="请输入表名称"
          clearable
          style="width: 200px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="表描述" prop="tableComment">
        <el-input
          v-model="queryParams.tableComment"
          placeholder="请输入表描述"
          clearable
          style="width: 200px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间" style="width: 308px">
        <el-date-picker
          v-model="dateRange"
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!--            <el-col :span="1.5">
                            <el-button
                                    type="primary"
                                    plain
                                    icon="Download"
                                    @click="handleGenTable"
                                    v-hasPermi="['tool:gen:code']"
                            >生成
                            </el-button>
                        </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="Upload"
          @click="openImportTable"
          v-hasPermi="['tool:gen:import']"
          >导入
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="disabledEdit"
          @click="handleEditTable"
          v-hasPermi="['tool:gen:edit']"
          >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="disabledDelete"
          @click="handleDelete"
          v-hasPermi="['tool:gen:remove']"
          >删除
        </el-button>
      </el-col>
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <trends-table
      :show-columns="showColumnsGenTable"
      :columns="tableList"
      :selection="true"
      :index="true"
      @selection-change="handleSelectionChange"
    >
      <template v-slot:operationsColumn>
        <el-table-column
          label="操作"
          align="center"
          width="330"
          class-name="small-padding fixed-width"
        >
          <template #default="scope">
            <!--                        <el-tooltip content="预览" placement="top">-->
            <!--                            <el-button link type="primary" icon="View" @click="handlePreview(scope.row)"-->
            <!--                                       v-hasPermi="['tool:gen:preview']"></el-button>-->
            <!--                        </el-tooltip>-->
            <el-tooltip content="编辑" placement="top">
              <el-button
                link
                type="primary"
                icon="Edit"
                @click="handleEditTable(scope.row)"
                v-hasPermi="['tool:gen:edit']"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                link
                type="primary"
                icon="Delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['tool:gen:remove']"
              ></el-button>
            </el-tooltip>
            <!--                        <el-tooltip content="同步" placement="top">-->
            <!--                            <el-button link type="primary" icon="Refresh" @click="handleSynchDb(scope.row)"-->
            <!--                                       v-hasPermi="['tool:gen:edit']"></el-button>-->
            <!--                        </el-tooltip>-->
            <!--                        <el-tooltip content="生成代码" placement="top">-->
            <!--                            <el-button link type="primary" icon="Download" @click="handleGenTable(scope.row)"-->
            <!--                                       v-hasPermi="['tool:gen:code']"></el-button>-->
            <!--                        </el-tooltip>-->
          </template>
        </el-table-column>
      </template>
    </trends-table>

    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 预览界面 -->
    <el-dialog
      :title="preview.title"
      v-model="preview.open"
      width="80%"
      top="5vh"
      append-to-body
      class="scrollbar"
    >
      <el-tabs v-model="preview.activeName">
        <el-tab-pane
          v-for="(value, key) in preview.data"
          :label="key.substring(key.lastIndexOf('/') + 1, key.indexOf('.vm'))"
          :name="key.substring(key.lastIndexOf('/') + 1, key.indexOf('.vm'))"
          :key="value"
        >
          <el-link
            :underline="false"
            icon="DocumentCopy"
            v-copyText="value"
            v-copyText:callback="copyTextSuccess"
            style="float: right"
            >&nbsp;复制
          </el-link>
          <pre>{{ value }}</pre>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!--导入-->
    <!--        <import-table ref="importRef"-->
    <!--                      @ok="handleQuery"-->
    <!--                      @import-sql="importSql"-->
    <!--                      @importDynamicTable="importDynamicTable"/>-->
    <import-gen-table
      ref="importRef"
      :show-tab="7"
      @ok="handleQuery"
      @import-sql="importSql"
      @importDynamicTable="importDynamicTable"
      :shared="{ show: false, value: true }"
    />
  </div>
</template>

<script setup name="GenTable">
import {
  listTable,
  previewTable,
  delTable,
  genCode,
  synchDb,
  updateGenTable,
} from "@/api/tool/gen";
import router from "@/router";
import trendsTable from "@/components/DbDog/trendsTable.vue";
import TrendsTable from "@/components/DbDog/trendsTable.vue";
import ImportTable from "@/views/tool/gentable/importTable.vue";
import { importGenTables, pageGenTable } from "@/api/system/genTable.js";
import importGenTable from "@/components/DbDog/importGenTable.vue";

const route = useRoute();
const { proxy } = getCurrentInstance();

const tableList = ref([]);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const disabledEdit = ref(true);
const disabledDelete = ref(true);
const total = ref(0);
const tableNames = ref([]);
const dateRange = ref([]);
const uniqueId = ref("");

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    tableName: undefined,
    tableComment: undefined,
  },
  preview: {
    open: false,
    title: "代码预览",
    data: {},
    activeName: "domain.java",
  },
});

const { queryParams, preview } = toRefs(data);

const showColumnsGenTable = ref([
  {
    key: "tableName",
    type: null,
    label: "表名称",
  },
  {
    key: "tableComment",
    type: null,
    label: "表注释",
  },
  {
    key: "createTime",
    type: null,
    label: "创建时间",
  },
  {
    key: "updateTime",
    type: null,
    label: "更新时间",
  },
]);

onActivated(() => {
  const time = route.query.t;
  if (time != null && time != uniqueId.value) {
    uniqueId.value = time;
    queryParams.value.pageNum = Number(route.query.pageNum);
    dateRange.value = [];
    proxy.resetForm("queryForm");
    getList();
  }
});

/** 查询表集合 */
function getList() {
  loading.value = true;
  pageGenTable(proxy.addDateRange(queryParams.value, dateRange.value)).then(
    (response) => {
      tableList.value = response.data.records;
      total.value = Number(response.data.total);
      loading.value = false;
    }
  );
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
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
  proxy.$refs["importRef"].show();
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
  proxy.$modal.msgSuccess("复制成功");
}

// 多选框选中数据
function handleSelectionChange(selection) {
  // debgger
  ids.value = selection.map((item) => item.tableId);
  tableNames.value = selection.map((item) => item.tableName);
  disabledEdit.value = !(selection.length === 1);
  disabledDelete.value = !(selection.length > 0);
}

/** 修改按钮操作 */
function handleEditTable(row) {
  // debgger
  const tableId = row.tableId || ids.value[0];
  router.push({
    path: "/tool/gentable/edit/index/" + tableId,
    query: { pageNum: queryParams.value.pageNum },
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  // debgger
  const tableIds = row.tableId || ids.value;
  proxy.$modal
    .confirm('是否确认删除表编号为"' + tableIds + '"的数据项？')
    .then(function () {
      return delTable(tableIds);
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    })
    .catch(() => {});
}

function importSql(genTable) {
  importGenTables([genTable]).then((res) => {
    proxy.$modal.msgSuccess(res.msg);
    if (res.code === 200) {
      getList();
    }
  });
}

function importDynamicTable(genTables) {
  // debgger
  importGenTables(genTables).then((res) => {
    proxy.$modal.msgSuccess(res.msg);
    if (res.code === 200) {
      getList();
    }
  });
}

getList();
</script>
