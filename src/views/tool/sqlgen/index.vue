<template>

    <div class="app-container">


        <el-row :gutter="10">

            <el-text class="mx-1" type="success" size="large">SQL生成器</el-text>

        </el-row>


        <div style="margin: 20px 0"/>

        <!--编辑表-->
        <keep-alive>
            <trends-table
                    :columns="tableSchemaList"
                    :show-columns="showColumnsGenTable"
                    :index="true"
                    :row-key-name="'tableId'"
                    :max-height="10000">
                <!--            展开-->
                <template v-slot:expandColumn>

                    <el-table-column label=""
                                     align="center"
                                     class-name="small-padding fixed-width"
                                     type="expand">
                        <template #default="scope">

                            <div class="centered-96">
                                <trends-table
                                        :columns="scope.row.columns"
                                        :index="true"
                                        :show-columns="showColumnsGenColumn"
                                        :row-key-name="'columnId'">

                                    <template v-slot:operationsColumn>

                                        <el-table-column label="Operate" align="center"
                                                         class-name="small-padding fixed-width"
                                                         fixed="right">
                                            <template #default="inscope">
                                                <el-button type="primary" link
                                                           @click="handleSaveGenTableColumn(inscope.row)">Save
                                                </el-button>
                                                <el-button type="danger" link
                                                           @click="handleDeleteColumn(scope.row.columns,inscope.row)">
                                                    Delete
                                                </el-button>
                                            </template>
                                        </el-table-column>
                                    </template>

                                    <template v-slot:expandColumn>
                                        <div style="margin: 8px 0"/>
                                        <el-table-column label="模拟" align="center"
                                                         class-name="small-padding fixed-width"
                                                         type="expand">
                                            <template #default="inscope">
                                                <div class="centered-90 bordered-div">
                                                    <column-from :ref="inscope.row.columnId"
                                                                 :column="inscope.row"
                                                                 :self-gen-table="scope.row"
                                                                 inline="true"
                                                                 :gen-table-list="tableSchemaList"
                                                                 :history-mock-params="inscope.row.historyMockParams">

                                                    </column-from>

                                                </div>
                                            </template>
                                        </el-table-column>

                                    </template>

                                    <template v-slot:footer>
                                        <div style="margin: 15px 15px">
                                            <!--       添加字段按键             -->
                                            <el-row :gutter="20">
                                                <el-col :span="8">
                                                    <el-button round
                                                               type="primary"
                                                               style="width: 100%"
                                                               @click="handleAddField(scope.row,fieldNew)"
                                                    >
                                                        新增字段
                                                    </el-button>
                                                </el-col>
                                                <el-col :span="8">
                                                    <el-button round
                                                               style="width: 100%"
                                                               type="primary"
                                                               @click="handleImportField(scope.row)"
                                                    >
                                                        导入字段
                                                    </el-button>
                                                </el-col>
                                                <el-col :span="8">
                                                    <el-button round
                                                               style="width: 100%"
                                                               type="primary"
                                                               @click="handleAddField(scope.row,fieldId,fieldCreateTime,fieldUpdateTime,fieldIsDelete)"
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

                    <el-table-column label="Operate"
                                     align="center"
                                     class-name="small-padding fixed-width"
                                     fixed="right">
                        <template #default="scope">
                            <el-button type="primary" link @click="handleSaveGenTable(scope.row)">Save</el-button>
                            <el-button type="danger" link @click="handleDeleteTable(tableSchemaList,scope.row)"
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
                                <el-button round
                                           style="width: 100%"
                                           type="success"
                                           @click="openImportTable">
                                    导入表
                                </el-button>
                            </el-col>
                            <el-col :span="12">
                                <el-button round
                                           style="width: 100%"
                                           type="success"
                                           @click="handleAddTableSchema(tableSchemaList,tableSchemaNew)">
                                    新增表
                                </el-button>
                            </el-col>
                        </el-row>
                    </div>


                </template>

            </trends-table>
        </keep-alive>
        <!--        生成数据展示-->
        <el-row :gutter="10">
            <!--            sql-->
            <el-col :span=12>

                <el-button type="primary"
                           plain
                           @click="handleGenerateBySchemaV4"
                           style="width: 100%">
                    SQL数据生成
                </el-button>

                <div style="margin: 20px 0"/>
                <template v-if="generateSQL.show">


                    <!--                    <el-tabs v-model="generateSQL.tabName1" type="border-card" default="all">

                                            <el-tab-pane
                                                    v-for="(item1,key1) in generateSQL.data"
                                                    :key="key1"
                                                    :label="key1"
                                                    :value="key1"
                                                    :name="key1">
                                                <el-tabs v-model="generateSQL.tabName2" type="border-card">

                                                    <el-tab-pane
                                                            v-for="(item2,key2) in generateSQL.data[generateSQL.tabName1]"
                                                            :label="item2.name"
                                                            :name="item2.name"
                                                            :key="item2.name"
                                                            :value="item2.name"

                                                    >

                                                        <el-link :underline="false" icon="DocumentCopy"
                                                                 v-copyText="item2.value"
                                                                 v-copyText:callback="copyTextSuccess" style="float:right">&nbsp;复制
                                                        </el-link>
                                                        <div height="400px">
                                                            <el-scrollbar>
                                                                <highlightjs

                                                                        :language="item2.fileType"
                                                                        :code="item2.value"/>
                                                            </el-scrollbar>

                                                        </div>
                                                    </el-tab-pane>
                                                </el-tabs>


                                            </el-tab-pane>
                                        </el-tabs>-->


                </template>
            </el-col>
            <!--            code-->
            <el-col :span="12">

                <el-row :gutter="10">
                    <el-col :span="8">
                        <el-button v-if="p.genConfig === undefined"
                                   :icon="CloseBold"
                                   plain
                                   type="primary"
                                   @click="selectGenConfig"
                                   style="width: 100%">
                            选择代码生成配置
                        </el-button>
                        <el-button v-if="p.genConfig !== undefined"
                                   :icon="Select"
                                   type="success"
                                   plain
                                   @click="selectGenConfig"
                                   style="width: 100%">
                            {{ p.genConfig.name }}
                        </el-button>
                    </el-col>
                    <el-col :span="8">
                        <el-button type="primary"
                                   plain
                                   @click="doPreviewCodeByGenConfigAndGenTables"
                                   style="width: 100%">
                            预览代码
                        </el-button>
                    </el-col>
                    <el-col :span="8">
                        <el-button type="primary"
                                   plain
                                   @click="doDownloadCodeByGenConfigAndGenTables"
                                   style="width: 100%">
                            下载生成代码
                        </el-button>
                    </el-col>
                </el-row>

                <div style="margin: 20px 0"/>
                <template v-if="generateCode.show">


                    <!--
                                        <el-tabs v-model="generateCode.tabName1" type="border-card" default="all">

                                            <el-tab-pane
                                                    v-for="(item1,key1) in generateCode.data"
                                                    :key="key1"
                                                    :label="key1"
                                                    :value="key1"
                                                    :name="key1">
                                                <el-tabs v-model="generateCode.tabName2" type="border-card">

                                                    <el-tab-pane
                                                            v-for="(item2,key2) in generateCode.data[generateCode.tabName1]"
                                                            :label="item2.fileName"
                                                            :name="item2.vmId"
                                                            :key="item2.vmId"


                                                    >

                                                        <el-link :underline="false" icon="DocumentCopy"
                                                                 v-copyText="item2.value"
                                                                 v-copyText:callback="copyTextSuccess" style="float:right">&nbsp;复制
                                                        </el-link>
                                                        <div height="400px">
                                                            <el-scrollbar>
                                                                <highlightjs :language="item2.fileType" :code="item2.value"/>
                                                            </el-scrollbar>
                                                        </div>
                                                    </el-tab-pane>
                                                </el-tabs>


                                            </el-tab-pane>
                                        </el-tabs>
                    -->


                </template>
            </el-col>
        </el-row>

        <el-collapse accordion>
            <el-collapse-item name="1">
                <template #title>
                    <div class="centered-70">
                        <el-text class="mx-1" size="large">SQL生成结果</el-text>
                    </div>
                </template>

                <el-tabs v-model="generateSQL.tabName1" type="border-card" default="all">

                    <el-tab-pane
                            v-for="(item1,key1) in generateSQL.data"
                            :key="key1"
                            :label="key1"
                            :value="key1"
                            :name="key1">
                        <el-tabs v-model="generateSQL.tabName2" type="border-card">

                            <el-tab-pane
                                    v-for="(item2,key2) in generateSQL.data[generateSQL.tabName1]"
                                    :label="item2.name"
                                    :name="item2.name"
                                    :key="item2.name"
                                    :value="item2.name"

                            >

                                <el-link :underline="false" icon="DocumentCopy"
                                         v-copyText="item2.value"
                                         v-copyText:callback="copyTextSuccess" style="float:right">&nbsp;复制
                                </el-link>
                                <div height="400px">
                                    <el-scrollbar>
                                        <highlightjs

                                                :language="item2.fileType"
                                                :code="item2.value"/>
                                    </el-scrollbar>

                                </div>
                            </el-tab-pane>
                        </el-tabs>


                    </el-tab-pane>
                </el-tabs>

            </el-collapse-item>

            <el-collapse-item name="2">
                <template #title>
                    <div class="centered-70">
                        <el-text class="mx-1" size="large">代码预览</el-text>
                    </div>

                </template>

                <el-tabs v-model="generateCode.tabName1" type="border-card" default="all">

                    <el-tab-pane
                            v-for="(item1,key1) in generateCode.data"
                            :key="key1"
                            :label="key1"
                            :value="key1"
                            :name="key1">
                        <el-tabs v-model="generateCode.tabName2" type="border-card">

                            <el-tab-pane
                                    v-for="(item2,key2) in generateCode.data[generateCode.tabName1]"
                                    :label="item2.fileName"
                                    :name="item2.vmId"
                                    :key="item2.vmId"


                            >

                                <el-link :underline="false" icon="DocumentCopy"
                                         v-copyText="item2.value"
                                         v-copyText:callback="copyTextSuccess" style="float:right">&nbsp;复制
                                </el-link>
                                <div height="400px">
                                    <el-scrollbar>
                                        <highlightjs :language="item2.fileType" :code="item2.value"/>
                                    </el-scrollbar>
                                </div>
                            </el-tab-pane>
                        </el-tabs>


                    </el-tab-pane>
                </el-tabs>

            </el-collapse-item>

        </el-collapse>

        <!--选择生成配置-->
        <el-dialog v-model="dialogGenConfig" :width="1000" draggable>
            <el-form :model="queryGenConfigParams"
                     v-show="showSearch">

                <el-space>
                    <el-form-item label="配置名称" prop="name">
                        <el-input
                                v-model="queryGenConfigParams.name"
                                placeholder="请输入配置名称"
                                clearable
                                style="width: 200px"
                                @keyup.enter="doPageGenConfig"
                        />
                    </el-form-item>
                    <el-form-item label="备注" prop="notes">
                        <el-input
                                v-model="queryGenConfigParams.notes"
                                placeholder="请输入备注"
                                clearable
                                style="width: 200px"
                                @keyup.enter="doPageGenConfig"
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
                        <el-button type="primary" icon="Search" @click="doPageGenConfig">搜索</el-button>
                    </el-form-item>

                </el-space>
            </el-form>

            <el-table v-loading="loadingGenConfig"
                      highlight-current-row
                      :data="genConfigs"

                      @current-change="handleGenConfig">

                <el-table-column label="序号" type="index" width="50" align="center">
                    <template #default="scope">
                        <span>{{
                            (queryGenConfigParams.pageNum - 1) * queryGenConfigParams.pageSize + scope.$index + 1
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
                <el-table-column label="创建时间" align="center" prop="createTime" width="160"/>
                <el-table-column label="更新时间" align="center" prop="updateTime" width="160"/>
            </el-table>

            <pagination
                    v-show="queryGenConfigParams.total>0"
                    :total="queryGenConfigParams.total"
                    v-model:page="queryGenConfigParams.pageNum"
                    v-model:limit="queryGenConfigParams.pageSize"
                    @pagination="doPageGenConfig"
            />
        </el-dialog>

        <!--导入表-->
        <import-gen-table ref="importGenTableRef"
                          :shared="{show:true,value:true}"
                          :selection-gen-table-rows="selectionGenTableRows"
                          :witch="'drawer'"
                          @import-sql="importGenTableBySql"
                          @importDynamicTable="importGenTableByDynamicTable"
                          @import-gen-table="importGenTableByGenTable"
        />

        <!--        导入字段-->
        <import-gen-column ref="importGenColumnRef"
                           :show-tab="3"
                           @import-dynamic-column="importGenTableByDynamicTable"
                           @import-gen-table-column="importGenTableColumn"
                           :witch="'drawer'"/>

        <!--        导入配置-->
        <import-gen-config ref="importGenConfigRef"
                           @import="handleImportGenConfig"
                           :shared="{show:true,value:true}"
                           :witch="'drawer'"/>

        <!--   字段保存     -->
        <el-dialog
                v-model="dialogSaveColumn"
                title="Tips"
                width="50%"
                draggable
                overflow>
            <columnFrom :column="data.p.pColumn" submit="true"></columnFrom>
        </el-dialog>

    </div>
</template>

<script setup name="SqlGen">
import {
    listTable,
    previewTable,
    delTable,
    genCode,
    synchDb,
    generateBySchemaV2,
    generateBySchemaV3, pageGenConfig, generateBySchemaV4
} from "@/api/tool/gen";
import router from "@/router";
import importTable from "./importTable";
import {isEmpty} from "element-plus/es/utils/index";
import {Calendar, CloseBold, Delete, Select} from "@element-plus/icons-vue";
import {splice} from "@/utils/objectUtils.js";
import {importGenTableColumns, pageGenTable, pageGenTableColumn} from "@/api/system/genTableColumn.js";
// import ColumnFrom from "@/components/SqlGen/columnFrom.vue";
import ColumnFrom from "@/components/DbDog/columnFrom.vue";

import TrendsTable from "@/components/DbDog/trendsTable.vue";
import ImportGenTable from "@/components/DbDog/importGenTable.vue";
import {importGenTables} from "@/api/system/genTable.js";
import ImportTable from "@/views/tool/gentable/importTable.vue";
import ImportGenColumn from "@/components/DbDog/importGenColumn.vue";
import {downloadCodeByGenConfigAndGenTables, previewCodeByGenConfigAndGenTables} from "@/api/system/codeGenerator.js";
import {blobValidate} from "@/utils/ruoyi.js";
import errorCode from "@/utils/errorCode.js";
import {ElLoading, ElMessage} from "element-plus";
import columnFromTest from "@/components/DbDog/columnFrom.vue"
import ImportGenConfig from "@/components/DbDog/importGenConfig.vue";
import ImportGenDict from "@/components/DbDog/importGenDict.vue";

// 常量
const showColumnsGenTable = ref([
    {
        key: "tableName",
        type: "input",
        label: "表名称"
    },
    {
        key: "tableComment",
        type: "input",
        label: "表注释"
    },
    {
        key: "mockNum",
        type: "input_number",
        label: "模拟条数"
    },
    {
        key: "databaseType",
        type: "select",
        label: "数据库类型",
        select: [
            {
                label: "MySQL",
                value: "MySQL"
            },
            {
                label: "PostgreSQL",
                value: "PostgreSQL"
            }
        ]
    }
])

/*const showColumnsGenColumn = ref([
    {
        label: "字段列名",
        type: "input",
        key: "columnName"
    },
    {
        label: "字段描述",
        type: "input",
        key: "columnComment"
    },
    {
        label: "默认值",
        type: "input",
        key: "defaulValue"
    },
    {
        label: "物理类型",
        type: "input",
        key: "columnType"
    },
    {
        label: "主键",
        key: "isPk",
        type: "check",
        check: {
            true: '1',
            false: '0'
        },

    },
    {
        label: "自增",
        key: "isIncrement",
        type: "check",
        check: {
            true: '1',
            false: '0'
        },

    },
    {
        label: "必填",
        key: "isRequired",
        type: "check",
        check: {
            true: '1',
            false: '0'
        },

    }
]);*/

const showColumnsGenColumn = ref([
    {
        label: "字段列名",
        type: "input",
        key: "columnName"
    },
    {
        label: "物理类型",
        type: "input",
        key: "columnType"
    },
    {
        label: "主键",
        key: "isPk",
        type: "check",
        check: {
            true: '1',
            false: '0'
        },

    },
    {
        label: "自增",
        key: "isIncrement",
        type: "check",
        check: {
            true: '1',
            false: '0'
        },

    },
    {
        label: "必填",
        key: "isRequired",
        type: "check",
        check: {
            true: '1',
            false: '0'
        },

    },
    {
        label: "模拟类型",
        type: "",
        key: "mockType"
    },
    {
        label: "模拟参数",
        type: "",
        key: "mockParams"
    }
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

    constructor(columnName, columnComment, columnType, defaultValue, isRequired, comment, isPk, isIncrement, mockType, mockParams, onUpdate) {
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
const fieldNew = new Filed(null, null, null, null, "0", null, "0", "0", "不模拟", '', null);
// 通用字段 - 主键
const fieldId = new Filed("id", "主键", "bigint(20)", null, "1", "主键", "1", "0", "不模拟", '', null);
// 通用字段 - 创建时间
const fieldCreateTime = new Filed("create_time", "创建时间", "datetime", "CURRENT_TIMESTAMP", "1", "创建时间", "0", "0", "不模拟", '', null);
// 通用字段 - 更新时间
const fieldUpdateTime = new Filed("update_time", "更新时间", "datetime", "CURRENT_TIMESTAMP", "1", "更新时间", "0", "0", "不模拟", '', null);
// 通用字段 - 逻辑删除
const fieldIsDelete = new Filed("is_delte", "逻辑删除", "tinyint", 0, "1", "是否逻辑删除 (o-否;1-是 )", "0", "0", "不模拟", '', null);

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
const {proxy} = getCurrentInstance();

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

const data = reactive({
    queryParams: {
        current: 1,
        pageSize: 10,
        searchName: undefined,
    }, pageGenTableColumnQueryParams: {
        current: 1,
        pageSize: 10,
        searchName: undefined,
    }, pageGenTableQueryParams: {
        current: 1,
        pageSize: 10,
        searchName: undefined,
    },
    sqlCodeFlag: false,
    sqlCode: {
        all: undefined
    },
    showTableName: "",
    tableSchemaList: [],
    tableListField: [
        fieldId, fieldCreateTime, fieldUpdateTime, fieldIsDelete
    ],
    p: {
        pTableSchema: undefined,
        pColumn: undefined,
        genConfig: undefined
    },
    pageGenTableData: {
        records: [],
        total: 0
    }, pageGenTableColumnData: {
        records: [],

        total: 0
    },
    generateSQL: {
        data: [{
            tableName: '',
            insertSql: '',
        }],
        tabName1: '',
        tabName2: '',
        show: false
    },
    generateCode: {
        data: [{
            tableName: '',
            insertSql: '',
        }],
        tabName1: '',
        tabName2: '',
        show: false
    },
    queryGenConfigParams: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        notes: undefined
    },
    genConfigs: []

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
    generateCode,
    queryGenConfigParams,
    genConfigs
} = toRefs(data);

const mockParams = {
    不模拟: {mockParams: '', placeholder: '不模拟', label: '不模拟'},
    递增: {mockParams: '', placeholder: '请输入起始值', label: '起始值'},
    固定: {mockParams: '', placeholder: '请输入固定值', label: '固定值'},
    随机: {mockParams: '', placeholder: '请选择随机规则', label: '随机'},
    规则: {mockParams: '', placeholder: '请输入正则表达式', label: '规则'},
    词库: {mockParams: '', placeholder: '请选择词库', label: '词库'},
    关联: {
        mockParams: ['', '', '',],
        placeholder: ['请选择关联表', '请选择关联字段', '数量关系'],
        label: ['关联表', '关联字段', '关联数量']
    },
}

let counts = {
    tableId: 0,
    columnId: 10000,
}

// 检查数组元素属性是否有值
function check(arr, name) {
    if (!arr) {
        arr = [];
    }

    for (let i = 0; i < arr.length; i++) {
        if (!arr[i][name]) {
            arr[i][name] = -(++counts[name]) + '0'; // 这里赋值为整数型的0
        }
    }

    return arr;
}

function checkGenTableColumn(arr) {
    if (!arr) {
        arr = [];
    }

    let mockParams = {
        '不模拟': {mockParams: '', placeholder: '不模拟', label: '不模拟'},
        '递增': {mockParams: '', placeholder: '请输入起始值', label: '起始值'},
        '固定': {mockParams: '', placeholder: '请输入固定值', label: '固定值'},
        '随机': {mockParams: '', placeholder: '请选择随机规则', label: '随机'},
        '规则': {mockParams: '', placeholder: '请输入正则表达式', label: '规则'},
        '词库': {mockParams: '', placeholder: '请选择词库', label: '词库'},
        '关联': {
            mockParams: ['', '', ''],
            placeholder: ['请选择关联表', '请选择关联字段', '数量关系'],
            label: ['关联表', '关联字段', '关联数量']
        }
    };

    arr.forEach(column => {
        column.historyMockParams = mockParams;
    });


    let name = "columnId";
    check(arr, name);

    return arr;
}

onActivated(() => {
    const time = route.query.t;
    if (time != null && time != uniqueId.value) {
        uniqueId.value = time;
        queryParams.value.current = Number(route.query.pageNum);
        dateRange.value = [];
        proxy.resetForm("queryForm");

    }
})


// 分页字段
function handelPageGenTableColumn() {
    pageGenTableColumn(proxy.addDateRange(pageGenTableColumnQueryParams.value, dateRange.value)).then(response => {
        data.pageGenTableColumnData.records = response.data.records;
        data.pageGenTableColumnData.total = response.data.total;
    });
}

// 分页表
function handlePageGenTable() {
    loading.value = true;
    pageGenTable(proxy.addDateRange(pageGenTableQueryParams.value, dateRange.value)).then(response => {
        data.pageGenTableData.records = response.data.records;
        data.pageGenTableData.total = response.data.total;

    });
}

/** 生成代码操作 */
function handleGenTable(row) {
    const tbNames = row.tableName || tableNames.value;
    if (tbNames == "") {
        proxy.$modal.msgError("请选择要生成的数据");
        return;
    }
    if (row.genType === "1") {
        genCode(row.tableName).then(response => {
            proxy.$modal.msgSuccess("成功生成到自定义路径：" + row.genPath);
        });
    } else {
        proxy.$download.zip("/tool/gen/batchGenCode?tables=" + tbNames, "ruoyi.zip");
    }
}


/**------------------表----------------------------*/
/** 删除表操作 */
function handleDeleteTable(array, row) {

    let pos = array.indexOf(row);
    splice(array, pos);
}

// 打开导入表弹窗
function openImportTable() {
    proxy.$refs["importGenTableRef"].show();
}

// 导入表 SQL
function importGenTableBySql(genTable) {
    debugger
    handleAddTableSchema(data.tableSchemaList, genTable)
    // data.tableSchemaList.push(genTable);

}

// 导入表 动态数据源
function importGenTableByDynamicTable(genTables) {
    debugger
    handleAddTableSchema(data.tableSchemaList, ...genTables)
}

// 导入表 生成表
function importGenTableByGenTable(genTables) {
    debugger
    handleAddTableSchema(data.tableSchemaList, ...genTables)
}

// 添加表操作
function handleAddTableSchema(tableSchemaList, ...tableSchemas) {
    debugger
    // 深拷贝
    const copiedTableSchemas = tableSchemas.map(schema => {
        // check(schema.columns, "columnId")
        checkGenTableColumn(schema.columns);
        return JSON.parse(JSON.stringify(schema))
    });
    check(copiedTableSchemas, "tableId")


    tableSchemaList.push(...copiedTableSchemas);
    proxy.$modal.msgSuccess('新增表');

}

// 导入字段 动态数据源
function importGenColumnByDynamicColumn(dynamicColumns) {
    dynamicColumns
    handleAddColumns(genTableColumns)
}

// 保存表
function handleSaveGenTable(genTable) {
    debugger
    importGenTables([genTable]).then(res => {
        proxy.$modal.msgSuccess(res.msg);
        if (res.code === 200) {
            proxy.$modal.msgSuccess(genTable.tableName + '表成功保存');
        }
    });
}

/**------------------表----------------------------*/


/**------------------字段----------------------------*/

// 添加字段操作
function handleAddColumns(columns) {

    debugger
    const copiedColumns = columns.map(filed => JSON.parse(JSON.stringify(filed)));
    // check(copiedColumns, "columnId")
    checkGenTableColumn(copiedColumns);
    data.p.pTableSchema.columns.push(...copiedColumns)
}

// 添加字段操作
function handleAddField(tableSchema, ...fileds) {
    const copiedFileds = fileds.map(filed => {
        return JSON.parse(JSON.stringify(filed))
    });
    checkGenTableColumn(copiedFileds);
    tableSchema.columns.push(...copiedFileds)
    proxy.$modal.msgSuccess('已新增字段');
}

// 导入字段 生成表
function importGenTableColumn(genTableColumns) {
    handleAddColumns(genTableColumns)
}

// 删除字段操作
function handleDeleteColumn(columns, row) {
    debugger
    let pos = columns.indexOf(row);
    splice(columns, pos);
}

// 导入字段操作
function handleImportField(tableSchema) {

    //  修改当前的操作表对象
    data.p.pTableSchema = tableSchema;
    // dialogOverflowVisibleColumn.value = true;
    // handlePageGenTable();
    // handelPageGenTableColumn();
    proxy.$refs["importGenColumnRef"].show();
}


// 保存字段
function handleSaveGenTableColumn(genTableColumn) {
    debugger
    importGenTableColumns({}, [genTableColumn]).then(res => {
        proxy.$modal.msgSuccess(res.msg);
        if (res.code === 200) {
            proxy.$modal.msgSuccess(genTableColumn.columnName + '字段成功保存');
        }
    });
}

/**------------------字段----------------------------*/


/**------------------代码生成配置----------------------------*/
// 打开选择配置
function selectGenConfig() {
    // debugger
    // dialogGenConfig.value = true;
    // if (data.genConfigs.length === 0) {
    //     doPageGenConfig();
    // }

    proxy.$refs["importGenConfigRef"].show();
}

// 查询配置
function doPageGenConfig() {
    loadingGenConfig.value = true;
    pageGenConfig(proxy.addDateRange(data.queryGenConfigParams, dateRangeGenConfig.value)).then(response => {
        let resData;
        console.log(response.data)
        if (response.hasOwnProperty('data')) {
            resData = response.data;
        } else {

            resData = response;
        }
        data.genConfigs = resData.records;
        debugger
        data.queryGenConfigParams.total = Number(resData.total);
        loadingGenConfig.value = false;
    });
}

// 选择配置
function handleGenConfig(row) {
    data.p.genConfig = row
    proxy.$modal.msgSuccess("选中" + row.name + "配置");

}

// 选择导入的配置
function handleImportGenConfig(rows) {
    if (rows.length === 1) {
        data.p.genConfig = rows[0]
        proxy.$modal.msgSuccess("选中 [" + data.p.genConfig.name + "] 配置");
    } else if (rows.length > 0) {
        data.p.genConfig = rows[0]
        proxy.$modal.msgSuccess("选中第一个配置 [" + data.p.genConfig.name + "] 配置");
    } else if (rows.length === 0) {
        proxy.$modal.msgWarning("最少选中一个配置");
    }


}

/**------------------代码生成配置----------------------------*/


/**------------------生成----------------------------*/
// 生成sql代码操作
function handleGenerateBySchemaV3() {
    let queryData = tableSchemaList.value;
    if (Array.isArray(queryData) && queryData.length > 0) {
        generateBySchemaV3(queryData).then(res => {
            data.generateSQL.data = res.data;
            data.generateSQL.show = true;
        });
    } else {
        proxy.$modal.msg('至少需要配置一个表结构');
    }
}

// 生成sql代码操作
function handleGenerateBySchemaV4() {
    let queryData = tableSchemaList.value;
    if (Array.isArray(queryData) && queryData.length > 0) {
        generateBySchemaV4(queryData).then(res => {
            data.generateSQL.data = res.data;
            data.generateSQL.show = true;
            proxy.$modal.msgSuccess("SQL数据成功生成");
        });
    } else {
        proxy.$modal.msg('至少需要配置一个表结构');
    }
}

// 预览代码
function doPreviewCodeByGenConfigAndGenTables() {

    let genConfig = data.p.genConfig;
    let genTableList = data.tableSchemaList;
    let flag = true;
    if (genConfig === null || genConfig === undefined) {
        proxy.$modal.msg('未选择配置');
        return;
    }
    if (!Array.isArray(genTableList) || genTableList.length === 0) {
        proxy.$modal.msg('至少需要配置一个表结构');
        return;
    }
    let queryData = {
        genConfigId: genConfig.id,
        genTableList: genTableList
    }
    previewCodeByGenConfigAndGenTables(queryData).then(res => {
        data.generateCode.data = res.data
        data.generateCode.show = true
        proxy.$modal.msgSuccess("预览代码成功生成");
    })
}

let downloadLoadingInstance;

// 下载代码
function doDownloadCodeByGenConfigAndGenTables() {

    let genConfig = data.p.genConfig;
    let genTableList = data.tableSchemaList;
    let flag = true;
    if (genConfig === null || genConfig === undefined) {
        proxy.$modal.msg('未选择配置');
        return;
    }
    if (!Array.isArray(genTableList) || genTableList.length === 0) {
        proxy.$modal.msg('至少需要配置一个表结构');
        return;
    }
    let queryData = {
        genConfigId: genConfig.id,
        genTableList: genTableList
    }

    proxy.downloadPlus("/dbdog/generator/downloadCodeByGenConfigAndGenTables",
        queryData,
        `dbdog.zip`);
}

/**------------------生成----------------------------*/


/**------------------其他----------------------------*/
// 复制代码成功
function copyTextSuccess() {
    debugger
    proxy.$modal.msgSuccess("复制成功");
}

/**------------------其他----------------------------*/


/** 预览按钮 */
function handlePreview(row) {
    previewTable(row.tableId).then(response => {
        preview.value.data = response.data;
        preview.value.open = true;
        preview.value.activeName = "domain.java";
    });
}

/** 修改按钮操作 */
function handleEditTable(row) {
    const tableId = row.tableId || ids.value[0];
    router.push({path: "/tool/gen-edit/index/" + tableId, query: {pageNum: queryParams.value.current}});
}

/** 修改按钮操作 */
function handleEditField(row) {
    const tableId = row.tableId || ids.value[0];
    router.push({path: "/tool/gen-edit/index/" + tableId, query: {pageNum: queryParams.value.current}});
}

/** 导入建表语句按钮操作 */
function handleGetSchemaBySql() {

    importTable({tables: tableNames}).then(res => {
        proxy.$modal.msgSuccess(res.msg);
        if (res.code === 200) {
            visible.value = false;
            emit("ok");
        }
    });
}

/** 生成sql代码操作 */
function handleGenerateBySchemaV2() {

    generateBySchemaV2(tableSchemaList.value).then(res => {
        data.sqlCode = res.data;
        data.sqlCodeFlag = true;
        data.showTableName = "all";
    });
}


function transitionJsonToString(jsonObj) {
    // 转换后的jsonObj受体对象
    var _jsonObj = null;
    // 判断传入的jsonObj对象是不是字符串，如果是字符串需要先转换为对象，再转换为字符串，这样做是为了保证转换后的字符串为双引号
    if (Object.prototype.toString.call(jsonObj) !== '[object String]') {
        try {
            _jsonObj = JSON.stringify(jsonObj);
        } catch (error) {
            // 转换失败错误信息
            console.error('您传递的json数据格式有误，请核对...');
            console.error(error);

        }
    } else {
        try {
            _jsonObj = jsonObj.replace(/(\')/g, '"');
            _jsonObj = JSON.stringify(JSON.parse(jsonObj));
        } catch (error) {
            // 转换失败错误信息
            console.error('您传递的json数据格式有误，请核对...');
            console.error(error);

        }
    }
    return _jsonObj;
}

function formatJson(jsonObj) {
    // 正则表达式匹配规则变量
    var reg = null;
    // 转换后的字符串变量
    var formatted = '';
    // 换行缩进位数
    var pad = 0;
    // 一个tab对应空格位数
    var PADDING = '&nbsp;&nbsp;&nbsp;&nbsp;';
    // json对象转换为字符串变量
    var jsonString = transitionJsonToString(jsonObj);
    if (!jsonString) {
        return jsonString;
    }
    // 存储需要特殊处理的字符串段
    var _index = [];
    // 存储需要特殊处理的“再数组中的开始位置变量索引
    var _indexStart = null;
    // 存储需要特殊处理的“再数组中的结束位置变量索引
    var _indexEnd = null;
    // 将jsonString字符串内容通过\r\n符分割成数组
    var jsonArray = [];
    // 正则匹配到{,}符号则在两边添加回车换行
    jsonString = jsonString.replace(/([\{\}])/g, '\r\n$1\r\n');
    // 正则匹配到[,]符号则在两边添加回车换行
    jsonString = jsonString.replace(/([\[\]])/g, '\r\n$1\r\n');
    // 正则匹配到,符号则在两边添加回车换行
    jsonString = jsonString.replace(/(\,)/g, '$1\r\n');
    // 正则匹配到要超过一行的换行需要改为一行
    jsonString = jsonString.replace(/(\r\n\r\n)/g, '\r\n');
    // 正则匹配到单独处于一行的,符号时需要去掉换行，将,置于同行
    jsonString = jsonString.replace(/\r\n\,/g, ',');
    // 特殊处理双引号中的内容
    jsonArray = jsonString.split('\r\n');
    jsonArray.forEach(function (node, index) {
        // 获取当前字符串段中"的数量
        var num = node.match(/\"/g) ? node.match(/\"/g).length : 0;
        // 判断num是否为奇数来确定是否需要特殊处理
        if (num % 2 && !_indexStart) {
            _indexStart = index;
        }
        if (num % 2 && _indexStart && _indexStart != index) {
            _indexEnd = index;
        }
        // 将需要特殊处理的字符串段的其实位置和结束位置信息存入，并对应重置开始时和结束变量
        if (_indexStart && _indexEnd) {
            _index.push({
                start: _indexStart,
                end: _indexEnd,
            });
            _indexStart = null;
            _indexEnd = null;
        }
    });
    // 开始处理双引号中的内容，将多余的"去除
    _index.reverse().forEach(function (item, index) {
        var newArray = jsonArray.slice(item.start, item.end + 1);
        jsonArray.splice(
            item.start,
            item.end + 1 - item.start,
            newArray.join('')
        );
    });
    // 奖处理后的数组通过\r\n连接符重组为字符串
    jsonString = jsonArray.join('\r\n');
    // 将匹配到:后为回车换行加大括号替换为冒号加大括号
    jsonString = jsonString.replace(/\:\r\n\{/g, ':{');
    // 将匹配到:后为回车换行加中括号替换为冒号加中括号
    jsonString = jsonString.replace(/\:\r\n\[/g, ':[');
    // 将上述转换后的字符串再次以\r\n分割成数组
    jsonArray = jsonString.split('\r\n');
    // 将转换完成的字符串根据PADDING值来组合成最终的形态
    jsonArray.forEach(function (item, index) {
        // console.log(item);
        var i = 0;
        // 表示缩进的位数，以tab作为计数单位
        var indent = 0;
        // 表示缩进的位数，以空格作为计数单位
        var padding = '';
        if (item.match(/\{$/) || item.match(/\[$/)) {
            // 匹配到以{和[结尾的时候indent加1
            indent += 1;
        } else if (
            item.match(/\}$/) ||
            item.match(/\]$/) ||
            item.match(/\},$/) ||
            item.match(/\],$/)
        ) {
            // 匹配到以}和]结尾的时候indent减1
            if (pad !== 0) {
                pad -= 1;
            }
        } else {
            indent = 0;
        }
        for (i = 0; i < pad; i++) {
            padding += PADDING;
        }
        formatted += padding + item + '<br />';
        pad += indent;
    });
    // 返回的数据需要去除两边的空格
    return formatted.trim();
}


provide('setData', (newData) => {
    data.tableSchemaList = newData;
});

provide('addData', (newData) => {

    data.tableSchemaList.push(newData);
});

provide('addDataArray', (newData) => {

    data.tableSchemaList.push(...newData);
});


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

.bordered-div {
    border: 2px dashed gray; /* 设置边框样式为虚线，宽度为2px，颜色为灰色 */
    padding: 10px; /* 可选：添加内边距以增加内容与边框之间的距离 */
}
</style>
