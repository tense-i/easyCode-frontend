<template>

    <div class="app-container">
        <!--连接配置-->
        <el-dialog
                v-model="dialogDataSourceModel"
                title="Tips"
                width="500"
                draggable
                overflow
        >
            <span>连接配置</span>
            <template #footer>
                <el-form
                        label-position="left"
                        label-width="100px"
                        :model="formDataSourceModel"
                        style="max-width: 460px"
                >
                    <el-form-item label="连接名">
                        <el-input v-model="formDataSourceModel.connectionName"/>
                    </el-form-item>
                    <el-form-item label="主机">
                        <el-input v-model="formDataSourceModel.ip"/>
                    </el-form-item>
                    <el-form-item label="端口">
                        <el-input v-model="formDataSourceModel.port"/>
                    </el-form-item>
                    <el-form-item label="初始化数据库">
                        <el-input v-model="formDataSourceModel.initializeDatabaseName"/>
                    </el-form-item>
                    <el-form-item label="用户名">
                        <el-input v-model="formDataSourceModel.username"/>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input v-model="formDataSourceModel.password"/>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="doUpdateOrSaveDataSourceModel">
                            提交
                        </el-button>
                    </el-form-item>
                </el-form>
            </template>
        </el-dialog>


        <el-container class="layout-container-demo" height="90%">

            <el-header style=" font-size: 12px">
                <div class="toolbar">
                    <el-dropdown>
                    <span>
                    <el-icon style="margin-right: 8px; margin-top: 1px">
                        <CirclePlusFilled/>
                    </el-icon>
                    连接
                    </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="openDialogDataSourceModel(mysqlDynamicDatabaseDataDto)">MySQL
                                </el-dropdown-item>
                                <el-dropdown-item @click="openDialogDataSourceModel(pgDynamicDatabaseDataDto)">
                                    PostgreSQL
                                </el-dropdown-item>

                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </el-header>


            <el-container height="500px">
                <el-main>
                    <el-row :gutter="20">

                        <el-col :span="4">
                            <el-scrollbar ref="scrollbarRef" height="580px" always @scroll="scroll">
                                <el-menu width="240px" @open="handleOpen">

                                    <!--                        连接-->
                                    <el-sub-menu :index="item1.name"
                                                 v-for="(item1,index1) in databaseDtos">
                                        <template #title>

                                            <el-dropdown>

                                                <el-icon style="margin-right: 8px; margin-top: 1px">
                                                    <Menu/>
                                                </el-icon>


                                                <template #dropdown>
                                                    <el-dropdown-menu>
                                                        <el-dropdown-item
                                                                @click="openDialogDataSourceModel(item1)">
                                                            编辑连接
                                                        </el-dropdown-item>
                                                        <el-dropdown-item
                                                                @click="doDdeleteDataSourceModel(item1)">
                                                            删除连接
                                                        </el-dropdown-item>


                                                    </el-dropdown-menu>
                                                </template>
                                            </el-dropdown>
                                            <span>{{ item1.name }}</span>
                                        </template>

                                        <!--                            数据库-->


                                        <el-sub-menu :index="item2.name"
                                                     v-for="(item2,index2) in item1.child">

                                            <template #title>
                                                <el-icon>
                                                    <Grid/>
                                                </el-icon>
                                                <span>{{ item2.name }}</span>
                                            </template>

                                            <el-menu-item :index="item3.name"
                                                          @click="viewTable(item1.value,item2.name,item3.name)"
                                                          v-for="(item3,index3) in item2.child">
                                                <template #title>
                                                    {{ item3.name }}
                                                </template>

                                            </el-menu-item>


                                        </el-sub-menu>
                                    </el-sub-menu>

                                </el-menu>
                            </el-scrollbar>
                        </el-col>

                        <el-col :span="20">
                            <el-tabs
                                    v-model="editableTabsValue"
                                    type="card"
                                    class="demo-tabs"
                                    closable
                                    @tab-remove="removeTab"
                            >
                                <el-tab-pane
                                        v-for="item in editableTabs"
                                        :key="item.name"
                                        :label="item.name"
                                        :name="item.name"
                                >
                                    <table-show :columns="item.data" :showColumns="tableShowColumns" :max-height="500">

                                    </table-show>
                                </el-tab-pane>
                            </el-tabs>
                        </el-col>

                    </el-row>
                </el-main>


            </el-container>

        </el-container>
    </div>

</template>

<script setup name="=Database">
import {ref} from 'vue'
import {CirclePlusFilled, Message, Setting} from '@element-plus/icons-vue'
import {databaseInfo, listDynamicColumn, listDynamicDatabaseData, listDynamicTable} from "@/api/system/database.js";
import {deleteDataSourceModel, updateOrSaveDataSourceModel} from "@/api/system/dataSourceModel.js";

import tableShow from "./tableShow.vue";
import TableShow from "@/views/tool/database/tableShow.vue";

let {proxy} = getCurrentInstance();

const typeEnum = ref({
    CONNECT: "connect",
    DATABASE: "database",
    TABLE: "table",
    COLUMN: "column",
})

const tableShowColumns = ref([
    {
        name: "columnName",
        type: null,
        alias: "名",
    },
    {
        name: "columnComment",
        type: null,
        alias: "注释",
    },
    {
        name: "columnType",
        type: null,
        alias: "字段类型",
    },
    {
        name: "defaultValue",
        type: null,
        alias: "默认值",
    },
    {
        name: "isPk",
        type: "yes-no",
        alias: "是否主键",
    },
    {
        name: "isIncrement",
        type: "yes-no",
        alias: "是否自增",
    }
])

// {
//     name: "isRequired",
//         type: "yes-no",
//     alias: "是否非空",
// },

const columnShowColumns = ref([
    {
        name: "name",
        type: null,
        alias: "表名",
    },
    {
        name: "comment",
        type: null,
        alias: "注释",
    },
])


class DataSourceModel {
    id;
    connectionName;
    databaseType;
    ip;
    port;
    initializeDatabaseName;
    username;
    password;

    constructor(id, connectionName, databaseType, ip, port, initializeDatabaseName, username, password) {
        this.id = id;
        this.connectionName = connectionName;
        this.databaseType = databaseType;
        this.ip = ip;
        this.port = port;
        this.initializeDatabaseName = initializeDatabaseName;
        this.username = username;
        this.password = password;
    }
}

let mysqlDataSourceModel = new DataSourceModel(null, null, "MySQL", "127.0.0.1", "3306", null, null, null);
let pgDataSourceModel = new DataSourceModel(null, null, "PostgreSQL", "127.0.0.1", "5432", null, null, null);

class DynamicDatabaseDataDto {
    name;
    value;

    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
}

let mysqlDynamicDatabaseDataDto = new DynamicDatabaseDataDto(null, mysqlDataSourceModel);
let pgDynamicDatabaseDataDto = new DynamicDatabaseDataDto(null, pgDataSourceModel);

class DatabaseInfoRequest {
    parentsName;
    name;
    type;
    databaseName;

    constructor(parentsName, name, type, databaseName) {
        this.parentsName = parentsName;
        this.name = name;
        this.type = type;
        this.databaseName = databaseName;
    }
}

let tabIndex = 2
const editableTabsValue = ref('')

const editableTabs = ref([])
const alreadyLoaded = ref([{
    name: null,
    childName: []
}])
const alreadyLoadedConnectName = ref([])
const alreadyLoadedDatabaseName = ref([])

const dialogDataSourceModel = ref(false)

const data = reactive({
    databaseDtos: [],
    p: {
        databaseDtos: [],
        dynamicDatabaseDataDto: {},
        dataSourceModel: {}
    }

});

const formDataSourceModel = ref({})

const {databaseDtos, p} = toRefs(data);


// 打开编辑
function openDialogDataSourceModel(dto) {


    dialogDataSourceModel.value = true;

    formDataSourceModel.value = JSON.parse(JSON.stringify(dto.value))

    data.p.dynamicDatabaseDataDto = dto


}

// 更新或者保存
function doUpdateOrSaveDataSourceModel() {

    debugger
    let save = typeof formDataSourceModel.value.id === 'undefined' || formDataSourceModel.value.id === null || formDataSourceModel.value.id === '';
    updateOrSaveDataSourceModel(formDataSourceModel.value).then(res => {

        if (res.code === 200) {

            data.p.dynamicDatabaseDataDto.name = res.data.connectionName;
            Object.assign(data.p.dynamicDatabaseDataDto.value, res.data)
            if (save) {
                let newDatabase = {
                    name: res.data.connectionName,
                    type: 'connect',
                    value: res.data
                }
                data.databaseDtos.push(newDatabase)
            }
            proxy.$modal.msgSuccess("添加/修改成功");
            dialogDataSourceModel.value = false;
        }
    })
}

// 删除连接
function doDdeleteDataSourceModel(row) {
    deleteDataSourceModel([row.value.id]).then(res => {
        debugger
        data.databaseDtos = data.databaseDtos.filter(dto => dto.value.id !== row.value.id);

        proxy.$modal.msgSuccess("删除成功");
    })
}


function doDatabaseInfo(databaseDtos, dataSourceModel, query) {
    debugger
    let temp = JSON.parse(JSON.stringify(dataSourceModel));
    if (query.databaseName != null) {
        temp.databaseName = query.databaseName;
    }
    // 是否已经初始化的标志
    databaseInfo(temp, query).then(res => {
        if (databaseDtos === null) {
            data.databaseDtos = res
        } else {
            databaseDtos.child = res
        }
        console.log(data.databaseDtos)
    })
}


// doDatabaseInfo(null, {}, new DatabaseInfoRequest("", "", "CONNECT", null));

// databaseName tableName columnName


// 加载数据库  - 表 菜单
function handleOpen(key, keyPath) {
    console.log('当前打开的子菜单的 index 是:', key);
    console.log('打开子菜单的 index 路径是:', keyPath);
    let key1 = keyPath[0];
    let key2 = null;
    let key3 = null;
    if (keyPath.length >= 2) {
        key2 = keyPath[1];
    }

    if (keyPath.length >= 3) {
        key3 = keyPath[2];
    }

    // 连接信息
    let dataSourceModel = findDynamicDatabaseDataDto(data.databaseDtos, key1);
    // 可能为空
    let database = findDynamicDatabaseDataDto(dataSourceModel.child, key2);


    let query = {
        type: database != null ? 'table' : 'database',

    }

    doListDynamicDatabaseData(database != null ? database : dataSourceModel, dataSourceModel.value, database != null ? database.name : null, query)


}

function findDynamicDatabaseDataDto(databaseDtos, name) {

    let res = null;
    if (databaseDtos != null) {

        databaseDtos.forEach((tab, index) => {
            if (tab.name === name) {
                res = tab;
            }
        })
    }
    return res;
}


function doListDynamicDatabaseData(dynamicDatabaseDataDto, dataSourceModel, databaseName, query) {

    let temp = JSON.parse(JSON.stringify(dataSourceModel));
    if (databaseName != null) {
        temp.databaseName = databaseName;
    }
    // 是否已经初始化的标志
    listDynamicDatabaseData(temp, query).then(res => {
        if (dynamicDatabaseDataDto === null) {
            data.databaseDtos = res
        } else {
            dynamicDatabaseDataDto.child = res
        }
        console.log(data.databaseDtos)
    })
}

// 查看表
function viewTable(dataSourceModel, queryDatabaseName, tableName) {
    let temp = JSON.parse(JSON.stringify(dataSourceModel));
    if (queryDatabaseName != null) {
        temp.databaseName = queryDatabaseName;
    }
    let connectionName = temp.connectionName;
    let databaseName = temp.databaseName;
    let targetName = tableName + " @" + databaseName + "(" + connectionName + ") - 库"
    // 是否已经初始化的标志
    let isExist = false

    const tabs = editableTabs.value

    tabs.forEach((tab, index) => {
        if (tab.name === targetName) {
            isExist = true;
        }
    })


    if (!isExist) {
        const newTab = {
            name: targetName,
            type: "table",
            data: [],
            child: []
        };

        listDynamicColumn(temp, {'tableName': tableName}).then(res => {
            newTab.data = res.data
            editableTabs.value.push(newTab);
            editableTabsValue.value = targetName
        })

    }
}

// 查看字段
const viewColumn = (row, r) => {

    console.log(row)
}


function doListTable(dataSourceModel, query) {

    let temp = JSON.parse(JSON.stringify(dataSourceModel));
    if (query.databaseName != null) {
        temp.databaseName = query.databaseName;
    }
    // 是否已经初始化的标志
    databaseInfo(temp, query).then(res => {
        if (databaseDtos === null) {
            data.databaseDtos = res
        } else {
            databaseDtos.child = res
        }
        console.log(data.databaseDtos)
    })
}

const addTab = (targetName) => {

    const newTabName = `${++tabIndex}`
    editableTabs.value.push({
        name: targetName,
        data: []
    })
    editableTabsValue.value = targetName
}
const removeTab = (targetName) => {
    const tabs = editableTabs.value
    let activeName = editableTabsValue.value
    if (activeName === targetName) {
        tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
                const nextTab = tabs[index + 1] || tabs[index - 1]
                if (nextTab) {
                    activeName = nextTab.name
                }
            }
        })
    }

    editableTabsValue.value = activeName
    editableTabs.value = tabs.filter((tab) => tab.name !== targetName)
}

// 加载数据源连接菜单
doListDynamicDatabaseData(null, null, null, {});

</script>

<style scoped>
.layout-container-demo .el-header {
    position: relative;
    background-color: var(--el-color-primary-light-7);
    color: var(--el-text-color-primary);
}

.layout-container-demo .el-aside {
    color: var(--el-text-color-primary);
    background: var(--el-color-primary-light-8);
}

.layout-container-demo .el-menu {
    border-right: none;
}

.layout-container-demo .el-main {
    padding: 0;
}

.layout-container-demo .toolbar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    right: 20px;
}
</style>
