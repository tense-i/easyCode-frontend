<template>
    <div class="app-container">

        <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
            <el-form-item label="配置名称" prop="name">
                <el-input
                        v-model="queryParams.name"
                        placeholder="请输入配置名称"
                        clearable
                        style="width: 200px"
                        @keyup.enter="doListGenDictByPage"
                />
            </el-form-item>
            <el-form-item label="备注" prop="content">
                <el-input
                        v-model="queryParams.content"
                        placeholder="请输入词库内容"
                        clearable
                        style="width: 200px"
                        @keyup.enter="doListGenDictByPage"
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
                <el-button type="primary" icon="Search" @click="doListGenDictByPage">搜索</el-button>
                <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <!--       功能按键-->
        <el-row :gutter="10" class="mb8">

            <el-col :span="1.5">
                <el-button
                        type="info"
                        plain
                        icon="Upload"
                        @click="openImport"
                >导入
                </el-button>
            </el-col>

            <el-col :span="1.5">
                <el-button
                        type="primary"
                        plain
                        icon="CopyDocument"
                        @click="handleCopy([])"
                        :disabled="cpoyDisabled"
                >复制
                </el-button>
            </el-col>

            <!--            <el-col :span="1.5">
                            <el-button
                                    type="info"
                                    plain
                                    icon="Upload"
                                    @click="openImport"
                                    v-hasPermi="['tool:gen:import']"
                            >导入
                            </el-button>
                        </el-col>-->

            <el-col :span="1.5">
                <el-button
                        type="success"
                        plain
                        icon="Edit"
                        :disabled="single"
                        @click="handleEditTable"
                >修改
                </el-button>
            </el-col>

            <el-col :span="1.5">
                <el-button
                        type="danger"
                        plain
                        icon="Delete"
                        :disabled="multiple"
                        @click="handleDelete([])"
                >删除
                </el-button>
            </el-col>

            <!--            <el-col :span="1.5">
                            <el-button
                                    type="primary"
                                    plain
                                    icon="Download"
                                    @click="handleCpoy"
                                    v-hasPermi="['tool:gen:code']"
                            >导出
                            </el-button>
                        </el-col>-->

            <el-col :span="1.5">
                <el-button
                        type="primary"
                        plain
                        icon="Plus"
                        @click="handleAddNew"

                >去创建
                </el-button>
            </el-col>


            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <trends-table v-loading="loading"
                      :columns="genDictList"
                      :show-columns="showColumnsGenDict"
                      :selection="true"
                      @selection-change="handleSelectionChange">
            <template v-slot:operationsColumn>
                <el-table-column label="操作" align="center" width="330" class-name="small-padding fixed-width">
                    <template #default="scope">

                        <el-tooltip content="编辑" placement="top">
                            <el-button link type="primary" icon="Edit" @click="handleEditTable(scope.row)"></el-button>
                        </el-tooltip>

                        <el-tooltip content="复制" placement="top">
                            <el-button link type="primary" icon="CopyDocument"
                                       @click="handleCopy([scope.row])"></el-button>
                        </el-tooltip>

                        <el-tooltip content="删除" placement="top">
                            <el-button link type="primary" icon="Delete" @click="handleDelete([scope.row])"
                                       v-hasPermi="['tool:gen:remove']"></el-button>
                        </el-tooltip>


                        <!--                    <el-tooltip content="预览" placement="top">
                                                <el-button link type="primary" icon="View" @click="handlePreview(scope.row)"
                                                           v-hasPermi="['tool:gen:preview']"></el-button>
                                            </el-tooltip>
                                            <el-tooltip content="编辑" placement="top">
                                                <el-button link type="primary" icon="Edit" @click="handleEditTable(scope.row)"></el-button>
                                            </el-tooltip>
                                            <el-tooltip content="删除" placement="top">
                                                <el-button link type="primary" icon="Delete" @click="handleDelete([scope.row])"
                                                           v-hasPermi="['tool:gen:remove']"></el-button>
                                            </el-tooltip>
                                            <el-tooltip content="同步" placement="top">
                                                <el-button link type="primary" icon="Refresh" @click="handleSynchDb(scope.row)"
                                                           v-hasPermi="['tool:gen:edit']"></el-button>
                                            </el-tooltip>
                                            <el-tooltip content="生成代码" placement="top">
                                                <el-button link type="primary" icon="Download" @click="handleGenTable(scope.row)"
                                                           v-hasPermi="['tool:gen:code']"></el-button>
                                            </el-tooltip>-->
                    </template>
                </el-table-column>

            </template>
            <template v-slot:index>
                <el-table-column label="序号" type="index" width="50" align="center">
                    <template #default="scope">
                        <span>{{ (queryParams.current - 1) * queryParams.pageSize + scope.$index + 1 }}</span>
                    </template>
                </el-table-column>
            </template>

        </trends-table>

        <el-dialog v-model="dialogGenDict" title="编辑词库" width="500" draggable>

            <el-form
                    ref="formEditGenDictRef"
                    style="max-width: 600px"
                    :model="data.p.genDict"
                    label-width="auto"
                    class="demo-dynamic"
            >
                <el-form-item
                        prop="name"
                        label="词库名"
                        :rules="[
                            {
                              required: true,
                              message: '请输入词库名',
                              trigger: 'blur',
                            }
                          ]">
                    <el-input v-model="data.p.genDict.name"/>
                </el-form-item>
                <el-form-item prop="shared"
                              label="是否共享">
                    <el-select
                            v-model="data.p.genDict.shared"
                            clearable
                            placeholder="是否共享"
                            style="width: 240px">
                        <el-option
                                v-for="item in [{label:'私有(仅自己可见)',value:false},{label:'共享(所有人可见)',value:true}]"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                        prop="content"
                        label="词库内容"
                        :rules="[
                            {
                              required: true,
                              message: '请输入词库内容',
                              trigger: 'blur',
                            }
                          ]">
                    <el-input v-model="data.p.genDict.content"
                              type="textarea"
                              :autosize="{ minRows: 4, maxRows: 40 }"
                              clearable/>
                </el-form-item>
            </el-form>


            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogGenDict = false">Cancel</el-button>
                    <el-button type="primary" @click="saveOrUpdateGenDict">
                        保存
                    </el-button>
                </div>
            </template>
        </el-dialog>


        <pagination
                v-show="queryParams.total>0"
                :total="queryParams.total"
                v-model:page="queryParams.current"
                v-model:limit="queryParams.pageSize"
                @pagination="doListGenDictByPage"
        />

        <!--导入词库-->
        <import-gen-dict ref="importGenDictRef"
                         :witch="'drawer'"
                         @import="handleCopy"
                         :shared="{show:false,value:true}"/>

    </div>
</template>

<script setup name="GenDict">
import {previewTable, delTable, genCode, synchDb, pageGenConfig} from "@/api/tool/gen";
import router from "@/router";
import {useRoute} from "vue-router";
import {addNewGenConfig, copyGenConfig, deleteGenConfig} from "@/api/system/genConfig.js";
import TrendsTable from "@/components/DbDog/trendsTable.vue";
import {ref} from "vue";
import {addGenDict, copyGenDict, deleteGenDict, listMyAddDictByPage, updateGenDict} from "@/api/system/genDict.js";
import ImportGenConfig from "@/components/DbDog/importGenConfig.vue";
import ImportGenDict from "@/components/DbDog/importGenDict.vue";


const route = useRoute();
const {proxy} = getCurrentInstance();

const tableList = ref([]);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const cpoyDisabled = ref(true);
const multiple = ref(true);
const total = ref(0);
const tableNames = ref([]);
const dateRange = ref([]);
const uniqueId = ref("");
const values = ref([]);

const data = reactive({
    queryParams: {
        current: 1,
        pageSize: 10,
        total: 0,
        name: undefined,
        content: undefined,
        sortField: 'update_time',
        sortOrder: 'descend',
    },
    p: {
        genDict: undefined
    }
});

const dialogGenDict = ref(false)
const {queryParams, p} = toRefs(data);

onActivated(() => {
    const time = route.query.t;
    if (time != null && time != uniqueId.value) {
        uniqueId.value = time;
        queryParams.value.pageNum = Number(route.query.pageNum);
        dateRange.value = [];
        proxy.resetForm("queryForm");
        getList();
    }
})

const genDictList = ref([]);
const showColumnsGenDict = [
    {
        key: "name",
        type: null,
        label: "词库"
    },
    {
        key: "content",
        type: null,
        label: "内容"
    },
    {
        key: "createTime",
        type: null,
        label: "创建时间"
    },
    {
        key: "updateTime",
        type: null,
        label: "修改时间"
    }
];

// 分页生成词库资源列表
function doListGenDictByPage() {
    listMyAddDictByPage(proxy.addDateRange(data.queryParams, dateRange.value)).then(res => {
        if (res.code === 200) {
            genDictList.value = res.data.records;
            data.queryParams.total = Number(res.data.total);
        }
    })
}

// 添加词库
function doAddGenDict() {
    addGenDict(data.p.genDict).then(res => {
        if (res.code === 200) {
            proxy.$modal.msgSuccess(data.p.genDict.name + "词库添加成功");
        }
    })
}


// 添加词库
function doUpdateGenDict() {
    updateGenDict(data.p.genDict).then(res => {
        if (res.code === 200) {
            proxy.$modal.msgSuccess(data.p.genDict.name + "词库修改成功");
        }
    })
}

function saveOrUpdateGenDict() {
    if (data.p.genDict.id === null) {
        doAddGenDict();
    } else {
        doUpdateGenDict();
    }
    dialogGenDict.value = false;
}

// 删除词库
function doDeleteGenDict() {


}

// 删除词库
function handleDelete(row) {
    const copyValue = row.length != 0 ? row : values.value;
    const ids = copyValue.map(item => item.id);
    proxy.$modal.confirm('是否确认删除选中配置项？').then(function () {
        return deleteGenDict({ids: ids})
    }).then(() => {
        doListGenDictByPage();
        proxy.$modal.msgSuccess("删除成功");
    }).catch(() => {
    });
}


/** 去创建 */
function handleAddNew() {

    let addGenDict = {
        name: '',
        content: '',
        id: null
    }
    handleEditTable(addGenDict);
}

/** 修改按钮操作 */
function handleEditTable(row) {
    data.p.genDict = row;
    dialogGenDict.value = true;
}

// 复制按钮操作
function handleCopy(row) {

    const copyValue = row.length != 0 ? row : values.value;
    const ids = copyValue.map(item => item.id);

    proxy.$modal.confirm('是否确认复制选中词库？').then(function () {
        return copyGenDict({ids: ids});
    }).then(() => {
        doListGenDictByPage()
        proxy.$modal.msgSuccess("复制成功");
    }).catch(() => {
    });
}

// 多选框选中数据
function handleSelectionChange(selection) {
    debugger
    ids.value = selection.map(item => item.id);
    values.value = selection.map(item => item);
    tableNames.value = selection.map(item => item.tableName);
    single.value = selection.length != 1;
    multiple.value = !selection.length;
    cpoyDisabled.value = !selection.length;
}

doListGenDictByPage()


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

/** 同步数据库操作 */
function handleSynchDb(row) {
    const tableName = row.tableName;
    proxy.$modal.confirm('确认要强制同步"' + tableName + '"表结构吗？').then(function () {
        return synchDb(tableName);
    }).then(() => {
        proxy.$modal.msgSuccess("同步成功");
    }).catch(() => {
    });
}

/** 打开导入表弹窗 */
function openImport() {
    proxy.$refs["importGenDictRef"].show();
}

/** 重置按钮操作 */
function resetQuery() {
    dateRange.value = [];
    proxy.resetForm("queryRef");
    handleQuery();
}

/** 预览按钮 */
function handlePreview(row) {
    previewTable(row.tableId).then(response => {
        preview.value.data = response.data;
        preview.value.open = true;
        preview.value.activeName = "domain.java";
    });
}

/** 复制代码成功 */
function copyTextSuccess() {
    proxy.$modal.msgSuccess("复制成功");
}


</script>
