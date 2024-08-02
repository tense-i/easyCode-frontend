<template>
  <!-- 导入表 -->
    <el-drawer v-if="witch === 'drawer'"
               :size="'45%'"
               title="导入表"
               v-model="visible">
        <el-tabs type="border-card">

            <el-tab-pane v-if="0!==(showTab&1)" label="SQL">


                <el-space :size="20" wrap>

                    <el-select
                            v-model="sql.type"
                            filterable
                            placeholder="数据库类型"
                    >
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
                <div style="margin: 10px 0"/>
                <el-input
                        v-model="sql.sql"
                        :rows="15"
                        type="textarea"
                        placeholder="请输入建表 SQL 语句"
                />

            </el-tab-pane>

            <el-tab-pane v-if="0!==(showTab&2)" label="生成表">

                <el-form :model="queryGenTableParams" ref="queryGenTableRef" :inline="true">
                    <el-form-item label="表名称" prop="tableName">
                        <el-input
                                v-model="queryGenTableParams.tableName"
                                placeholder="请输入表名称"
                                clearable
                                @keyup.enter="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item label="表描述" prop="tableComment">
                        <el-input
                                v-model="queryGenTableParams.tableComment"
                                placeholder="请输入表描述"
                                clearable
                                @keyup.enter="handleQuery"
                        />
                    </el-form-item>


                    <el-form-item v-if="localShared.show" style="width: 150px">
                        <el-select
                                v-model="localShared.value"
                                @change="handleQuery"
                                clearable
                                placeholder="Select"
                                style="width: 240px">
                            <el-option
                                    v-for="item in [{label:'我的创建',value:false},{label:'在线共享',value:true}]"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                            />
                        </el-select>
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
                        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="importGenTableEmit">导入</el-button>
                    </el-form-item>

                </el-form>

                <trends-table :max-height="300"
                              :columns="listGenTableData"
                              :show-columns="showColumnsGenTable"
                              :selection="true"
                              :index="true"
                              @selection-change="selectionChangeGenTable">
                </trends-table>

                <pagination
                        v-show="queryGenTableParams.total>0"
                        :total="queryGenTableParams.total"
                        v-model:page="queryGenTableParams.current"
                        v-model:limit="queryGenTableParams.pageSize"
                        @pagination="doPageGenTable"
                />


            </el-tab-pane>

            <el-tab-pane v-if="0!==(showTab&4)" label="数据源">
                <el-space :size="10" spacer="">

                    <el-select v-model="selectDataSourceModelName"
                               @change="changeListDynamicDatabase"
                               placeholder="请选择数据源">
                        <el-option
                                v-for="item in listDataSourceModelData"
                                :key="item.connectionName"
                                :label="item.connectionName"
                                :value="item.connectionName"
                                @click=""
                        >
                        </el-option>
                    </el-select>

                    <el-select v-model="selectDynamicDatabaseName"
                               @change="changeListDynamicTable"
                               placeholder="请选择数据库">
                        <el-option
                                v-for="item in listDynamicDatabaseData"
                                :key="item.databaseName"
                                :label="item.databaseName"
                                :value="item.databaseName"
                                @click=""
                        >
                        </el-option>
                    </el-select>

                    <el-button type="primary"
                               @click="importDynamicTableEmits">导入
                    </el-button>


                </el-space>
                <div style="margin: 20px 0"></div>
                <trends-table ref="importDynamicTable"
                              :max-height="300"
                              :columns="listDynamicTableData"
                              :show-columns="showColumnsGenTable"
                              :selection="true"
                              :index="true"
                              @selection-change="selectionChangeTable">

                </trends-table>

                <!--                <trends-table-test ref="importDynamicTableTest"-->
                <!--                              :columns="listDynamicTableData"-->
                <!--                              :show-columns="showColumnsGenTable"-->
                <!--                              :selection="true">-->

                <!--                </trends-table-test>-->
            </el-tab-pane>

        </el-tabs>
    </el-drawer>

    <el-dialog v-if="witch === 'dialog'"
               title="导入表"
               v-model="visible"
               width="800px"
               top="5vh"
               append-to-body draggable>

        <el-tabs type="border-card">

            <el-tab-pane v-if="0!==(showTab&1)" label="SQL">


                <el-space :size="20" wrap>

                    <el-select
                            v-model="sql.type"
                            filterable
                            placeholder="数据库类型"
                    >
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
                <div style="margin: 10px 0"/>
                <el-input
                        v-model="sql.sql"
                        :rows="15"
                        type="textarea"
                        placeholder="请输入建表 SQL 语句"
                />

            </el-tab-pane>

            <el-tab-pane v-if="0!==(showTab&2)" label="生成表">

                <el-form :model="queryGenTableParams" ref="queryGenTableRef" :inline="true">
                    <el-form-item label="表名称" prop="tableName">
                        <el-input
                                v-model="queryGenTableParams.tableName"
                                placeholder="请输入表名称"
                                clearable
                                @keyup.enter="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item label="表描述" prop="tableComment">
                        <el-input
                                v-model="queryGenTableParams.tableComment"
                                placeholder="请输入表描述"
                                clearable
                                @keyup.enter="handleQuery"
                        />
                    </el-form-item>


                    <el-form-item v-if="localShared.show" style="width: 150px">
                        <el-select
                                v-model="localShared.value"
                                @change="handleQuery"
                                clearable
                                placeholder="Select"
                                style="width: 240px">
                            <el-option
                                    v-for="item in [{label:'我的创建',value:false},{label:'在线共享',value:true}]"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                            />
                        </el-select>
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
                        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="importGenTableEmit">导入</el-button>
                    </el-form-item>

                </el-form>

                <trends-table :max-height="300"
                              :columns="listGenTableData"
                              :show-columns="showColumnsGenTable"
                              :selection="true"
                              :index="true"
                              @selection-change="selectionChangeGenTable">
                </trends-table>

                <pagination
                        v-show="queryGenTableParams.total>0"
                        :total="queryGenTableParams.total"
                        v-model:page="queryGenTableParams.current"
                        v-model:limit="queryGenTableParams.pageSize"
                        @pagination="doPageGenTable"
                />


            </el-tab-pane>

            <el-tab-pane v-if="0!==(showTab&4)" label="数据源">
                <el-space :size="10" spacer="">

                    <el-select v-model="selectDataSourceModelName"
                               @change="changeListDynamicDatabase"
                               placeholder="请选择数据源">
                        <el-option
                                v-for="item in listDataSourceModelData"
                                :key="item.connectionName"
                                :label="item.connectionName"
                                :value="item.connectionName"
                                @click=""
                        >
                        </el-option>
                    </el-select>

                    <el-select v-model="selectDynamicDatabaseName"
                               @change="changeListDynamicTable"
                               placeholder="请选择数据库">
                        <el-option
                                v-for="item in listDynamicDatabaseData"
                                :key="item.databaseName"
                                :label="item.databaseName"
                                :value="item.databaseName"
                                @click=""
                        >
                        </el-option>
                    </el-select>

                    <el-button type="primary"
                               @click="importDynamicTableEmits">导入
                    </el-button>


                </el-space>
                <div style="margin: 20px 0"></div>
                <trends-table ref="importDynamicTable"
                              :max-height="300"
                              :columns="listDynamicTableData"
                              :show-columns="showColumnsGenTable"
                              :selection="true"
                              :index="true"
                              @selection-change="selectionChangeTable">

                </trends-table>

                <!--                <trends-table-test ref="importDynamicTableTest"-->
                <!--                              :columns="listDynamicTableData"-->
                <!--                              :show-columns="showColumnsGenTable"-->
                <!--                              :selection="true">-->

                <!--                </trends-table-test>-->
            </el-tab-pane>

        </el-tabs>

    </el-dialog>

</template>

<script setup>
import {listDataSourceModel} from "@/api/system/dataSourceModel.js";
import {listDynamicDatabase, listDynamicTable} from "@/api/system/dynamicData.js";
import {dynamicTableConvertGenTable} from "@/api/system/genTable.js";
import {pageGenTable, pageSharedGenTable} from "@/api/system/genTableColumn.js";
import {defineProps} from "vue";

import TrendsTable from "@/components/DbDog/trendsTable.vue";
import {getGenTableBySql} from "@/api/tool/gen.js";

// 常量

const dbTypeOptions = {
    MySQL: {
        name: 'MySQL',
        sql: "CREATE TABLE `user_info` (\n  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',\n  `user_name` varchar(256) DEFAULT NULL COMMENT '用户昵称',\n  `user_account` varchar(256) NOT NULL COMMENT '账号',\n  `user_avatar` varchar(1024) DEFAULT NULL COMMENT '用户头像',\n  `gender` tinyint(4) DEFAULT NULL COMMENT '性别',\n  `user_role` varchar(256) NOT NULL DEFAULT 'user' COMMENT '用户角色：user/ admin',\n  `user_password` varchar(512) NOT NULL COMMENT '密码',\n  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',\n  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',\n  `is_delete` tinyint(4) NOT NULL DEFAULT '0' COMMENT '是否删除',\n  PRIMARY KEY (`id`) USING BTREE,\n  UNIQUE KEY `uni_userAccount` (`user_account`) USING BTREE\n) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户';"
    },
    PostgreSQL: {
        name: 'PostgreSQL',
        sql: "CREATE TABLE `user_info` (\n  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',\n  `user_name` varchar(256) DEFAULT NULL COMMENT '用户昵称',\n  `user_account` varchar(256) NOT NULL COMMENT '账号',\n  `user_avatar` varchar(1024) DEFAULT NULL COMMENT '用户头像',\n  `gender` tinyint(4) DEFAULT NULL COMMENT '性别',\n  `user_role` varchar(256) NOT NULL DEFAULT 'user' COMMENT '用户角色：user/ admin',\n  `user_password` varchar(512) NOT NULL COMMENT '密码',\n  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',\n  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',\n  `is_delete` tinyint(4) NOT NULL DEFAULT '0' COMMENT '是否删除',\n  PRIMARY KEY (`id`) USING BTREE,\n  UNIQUE KEY `uni_userAccount` (`user_account`) USING BTREE\n) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户';"

    }
}

const showColumnsGenTable = ref([
    {
        key: "tableName",
        type: null,
        label: "表名称"
    },
    {
        key: "tableComment",
        type: null,
        label: "表注释"
    }
    ,
    {
        key: "createTime",
        type: null,
        label: "创建时间"
    }

])


const total = ref(0);
const visible = ref(false);
const tables = ref([]);
const dateRange = ref([]);

const {proxy} = getCurrentInstance();

const queryGenTableParams = reactive({
    pageNum: 1,
    pageSize: 10,
    total: 0,
    tableName: undefined,
    tableComment: undefined,
});

const sql = reactive({
    type: "MySQL",
    sql: null
});

// const queryGenTableParams = ref({
//     pageNum: 1,
//     pageSize: 10,
//     total: 0,
//     tableName: undefined,
//     tableComment: undefined,
// });
//
// const sql = ref({
//     type: "MySQL",
//     sql: null
// });


const selectionTable = ref([]);
const selectionGenTableRows = ref([]);

const listDataSourceModelData = ref([]);

const selectDataSourceModelName = ref('');

const listDynamicDatabaseData = ref([]);

const selectDynamicDatabaseName = ref('');

const listDynamicTableData = ref([]);

const listGenTableData = ref([]);

const {showTab, shared,witch} = defineProps({

    showTab: {
        type: Number,
        default: 7
    },
    shared: {
        type: Object,
        default: {
            show: true,
            value: false
        }
    },
    witch: {
        type: String,
        default: 'dialog'
    }
});


const localShared = ref(shared)

// 导入genTables事件 返回genTables
// 导入sql事件 返回genTable
let $emit = defineEmits(['importSql', 'importDynamicTable', 'importGenTable']);


/*建表语句*/


const importSqlEmits = () => {
    const queryData = {
        sql: sql.sql,
        type: sql.type
    }
    getGenTableBySql(queryData).then(res => {
        if (res.code === 200) {
            $emit('importSql', res.data)
            proxy.$modal.msgSuccess('SQL导入表成功');
        }

    });

}


/** 导入示例按钮操作 */
function handleExampleSQL() {
    sql.sql = dbTypeOptions[sql.type].sql
}


// 重置SQL
function resetSQL() {
    sql.sql = null
}


/*建表语句*/


/*数据源导入*/

// 查看数据源
function doListDataSourceModel() {
    listDataSourceModel({}).then(res => {
        if (res.code === 200) {
            listDataSourceModelData.value = res.data
        }
    })
}

// 查看数据库
function changeListDynamicDatabase() {

    let dataSourceModelName = selectDataSourceModelName.value;
    // 使用 find 方法找到元素
    const dataSourceModel = listDataSourceModelData.value.find(element => element.connectionName === dataSourceModelName);
    listDynamicDatabase(dataSourceModel, {}).then(res => {
        if (res.code === 200) {
            listDynamicDatabaseData.value = res.data
            selectDynamicDatabaseName.value = ''
            listDynamicTableData.value = []
        }
    })
}

// 查看表
function changeListDynamicTable() {

    let dataSourceModelName = selectDataSourceModelName.value;
    // 使用 find 方法找到元素
    const dataSourceModel = listDataSourceModelData.value.find(element => element.connectionName === dataSourceModelName);
    dataSourceModel.databaseName = selectDynamicDatabaseName.value;
    listDynamicTable(dataSourceModel, {isChild: true}).then(res => {
        if (res.code === 200) {
            listDynamicTableData.value = res.data
        }
    })
}

// 动态表选中
function selectionChangeTable(rows) {
    selectionTable.value = rows;
}

// 导入动态表
const importDynamicTableEmits = () => {
    debugger
    // let multipleSelection = proxy.$refs["importDynamicTable"].multipleSelection;
    dynamicTableConvertGenTable(selectionTable.value).then(res => {
        if (res.code === 200) {
            $emit('importDynamicTable', res.data)
            proxy.$modal.msgSuccess('数据源-导入表成功');
        }

    });

}

/*数据源导入*/





/*生成表导入*/

function doPageGenTable() {

    if (localShared.value.value) {
        pageSharedGenTable(proxy.addDateRange(queryGenTableParams, dateRange.value)).then(res => {
            listGenTableData.value = res.data.records;
            queryGenTableParams.total = Number(res.data.total);
        });
    } else {
        pageGenTable(proxy.addDateRange(queryGenTableParams, dateRange.value)).then(res => {
            listGenTableData.value = res.data.records;
            queryGenTableParams.total = Number(res.data.total);
        });
    }
}

// 查询
function handleQuery() {
    queryGenTableParams.pageNum = 1;
    doPageGenTable();
}

// 重置按钮操作
function resetQuery() {
    proxy.resetForm("queryGenTableRef");
    handleQuery();
}


// 动态表选中
function selectionChangeGenTable(rows) {
    selectionGenTableRows.value = rows;
}

// 导入
function importGenTableEmit() {
    debugger
    let genTables = selectionGenTableRows.value;
    if (genTables.length === 0) {
        proxy.$modal.msgError("请选择要导入的表");
        return;
    }

    $emit('importGenTable', genTables)
    proxy.$modal.msgSuccess('生成表-导入表成功');

}


/*生成表导入*/
function show() {
    doListDataSourceModel();
    doPageGenTable();
    visible.value = true;
}

defineExpose({
    show,
});


</script>
