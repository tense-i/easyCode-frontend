<template>
  <!-- 导入表 -->

    <el-dialog title="导入表" v-model="visible" width="800px" top="5vh" append-to-body>

        <el-tabs type="border-card">

            <el-tab-pane label="导入建表语句">

                <el-text size="large">
                    请输入建表 SQL 语句：
                    <el-button round @click="handleExampleSQL()">导入示例</el-button>
                    <el-select
                            v-model="sql.type"
                            filterable
                            placeholder="数据库类型"
                            style="width: 240px"
                    >
                        <el-option
                                v-for="item in dbTypeOptions"
                                :key="item.name"
                                :label="item.name"
                                :value="item.name"
                        />
                    </el-select>
                </el-text>
                <div style="margin: 20px 0"/>
                <el-input
                        v-model="sql.sql"
                        :rows="15"
                        type="textarea"
                        placeholder="Please input"
                />
                <div style="margin: 20px 0"/>

                <el-row class="mb-4">
                    <el-button type="primary" @click="importSqlEmits">导入</el-button>
                    <el-button @click="resetSQL">重置</el-button>
                </el-row>
            </el-tab-pane>

            <el-tab-pane label="数据源导入">
                <el-space :size="size" spacer="|">

                    <el-select v-model="selectDataSourceModelName"
                               @change="changeListDynamicDatabase"
                               placeholder="Select"
                               style="width: 240px">
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
                               placeholder="Select"
                               style="width: 240px">
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

                <trends-table ref="importDynamicTable"
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


        <template #footer>
            <div class="dialog-footer">
                <el-button @click="visible = false">取 消</el-button>
            </div>
        </template>

    </el-dialog>

</template>

<script setup>
import {listDbTable, importTable, getGenTableBySql} from "@/api/tool/gen";
import {listDataSourceModel} from "@/api/system/dataSourceModel.js";
import {listDynamicDatabase, listDynamicTable} from "@/api/system/dynamicData.js";
import trendsTable from "@/components/DbDog/trendsTable.vue"
import TrendsTable from "@/components/DbDog/trendsTable.vue";
import TrendsTableTest from "@/components/DbDog/trendsTableTest.vue";
import {dynamicTableConvertGenTable} from "@/api/system/genTable.js";

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

const {proxy} = getCurrentInstance();

const queryParams = reactive({
    pageNum: 1,
    pageSize: 10,
    tableName: undefined,
    tableComment: undefined
});

const sql = reactive({
    type: "MySQL",
    sql: null
});


const selectionTable = ref([]);

const dynamicDataQueryParams = reactive({
    connectionName: null,
    databaseName: null,

});

const listDataSourceModelData = ref([]);

const selectDataSourceModelName = ref('');

const listDynamicDatabaseData = ref([]);

const selectDynamicDatabaseName = ref('');

const listDynamicTableData = ref([]);

const selectDynamicTableName = ref('');

const listDynamicColumnData = ref([]);


// 导入genTables事件 返回genTables
// 导入sql事件 返回genTable
let $emit = defineEmits(['importSql', 'importDynamicTable']);


/*建表语句*/


const importSqlEmits = () => {
    const queryData = {
        sql: sql.sql,
        type: sql.type
    }
    getGenTableBySql(queryData).then(res => {
        if (res.code === 200) {
            $emit('importSql', res.data)
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
    // debugger
    // let multipleSelection = proxy.$refs["importDynamicTable"].multipleSelection;
    dynamicTableConvertGenTable(selectionTable.value).then(res => {
        if (res.code === 200) {
            $emit('importDynamicTable', res.data)
        }

    });

}

/*数据源导入*/

/** 查询参数列表 */
function show() {
    doListDataSourceModel()
    visible.value = true;
}

/** 单击选择行 */
function clickRow(row) {
    proxy.$refs.table.toggleRowSelection(row);
}









/** 导入按钮操作 */
function handleImportTable() {
    const tableNames = tables.value.join(",");
    if (tableNames == "") {
        proxy.$modal.msgError("请选择要导入的表");
        return;
    }
    importTable({tables: tableNames}).then(res => {
        proxy.$modal.msgSuccess(res.msg);
        if (res.code === 200) {
            visible.value = false;
            emit("ok");
        }
    });
}



defineExpose({
    show,
});


</script>
