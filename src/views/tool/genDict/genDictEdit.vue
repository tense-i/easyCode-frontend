<template>
    <div class="app-container">


        <el-tabs v-model="activeName">


            <el-tab-pane label="生成信息" name="genInfo">


                <div>
                    <el-form :model="propertiesInfo"
                             label-width="150px">

                        <el-row>


                            <el-col :span="12">
                                <el-form-item prop="name" label="配置名">

                                    <el-input v-model="propertiesInfo.name"/>
                                </el-form-item>
                            </el-col>

                            <el-col :span="12">
                                <el-form-item prop="notes" label="备注">

                                    <el-input v-model="propertiesInfo.notes"/>
                                </el-form-item>
                            </el-col>


                            <el-col :span="12">
                                <el-form-item prop="packagePath">
                                    <template #label>
                                        生成包路径
                                        <el-tooltip
                                                content="生成在哪个java包下，例如 io.xizi.easycode vm变量名为 packagePath"
                                                placement="top">
                                            <el-icon>
                                                <question-filled/>
                                            </el-icon>
                                        </el-tooltip>
                                    </template>
                                    <el-input v-model="propertiesInfo.packagePath"/>
                                </el-form-item>
                            </el-col>

                            <el-col :span="12">
                                <el-form-item prop="moduleName">
                                    <template #label>
                                        生成模块名
                                        <el-tooltip content="可理解为子系统名，例如 system vm变量名为 moduleName"
                                                    placement="top">
                                            <el-icon>
                                                <question-filled/>
                                            </el-icon>
                                        </el-tooltip>
                                    </template>
                                    <el-input v-model="propertiesInfo.moduleName"/>
                                </el-form-item>
                            </el-col>

                            <el-col :span="12">
                                <el-form-item prop="tablePrefixArray">
                                    <template #label>
                                        表前缀
                                        <el-tooltip content="表前缀（可多个值，使用，分割）如 表名为 easycode_user_info,前缀为 easycode，那么生成className为userInfo"
                                                    placement="top">
                                            <el-icon>
                                                <question-filled/>
                                            </el-icon>
                                        </el-tooltip>
                                    </template>
                                    <el-input v-model="propertiesInfo.tablePrefixArray"/>
                                </el-form-item>
                            </el-col>

                            <el-col :span="12">
                                <el-form-item prop="moduleName">
                                    <template #label>
                                        生成作者
                                        <el-tooltip content="vm变量设置为 author" placement="top">
                                            <el-icon>
                                                <question-filled/>
                                            </el-icon>
                                        </el-tooltip>
                                    </template>
                                    <el-input v-model="propertiesInfo.functionAuthor"/>
                                </el-form-item>
                            </el-col>


                        </el-row>
                    </el-form>
                </div>

                <h1>系统</h1>
                <h2>时间</h2>
                <ul>
                    <li>date - 格式： yyyy-MM-dd</li>
                    <li>datetime - 格式：yyyy-MM-dd HH:mm:ss</li>
                </ul>

                <h2>基本生成信息</h2>
                <ol>
                    <li>packagePath</li>
                    <li>moduleName</li>
                    <li>author</li>
                </ol>

                <h2>表名转换成Java类名</h2>
                <ul>
                    <li>ClassName</li>
                    <li>className</li>
                    <li>classComment</li>
                </ul>

                <h2>列名转换成Java属性名</h2>
                <p>filed(Java字段)</p>
                <ul>
                    <li>pk（boolean类型，是否主键）</li>
                    <li>JavaName</li>
                    <li>javaName</li>
                    <li>javaComment</li>
                    <li>javaType</li>
                </ul>
                <ol>
                    <li>pKfiled(主键Java字段)</li>
                    <li>fileds（字段集合）</li>
                </ol>
            </el-tab-pane>

            <el-tab-pane label="字段映射信息" name="columnMapping">


                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-space size="10" spacer="|">
                            <el-tooltip
                                    content="物理类型与Java字段映射关系"
                                    placement="top">
                                <el-text>
                                    字段映射
                                    <el-icon>
                                        <question-filled/>
                                    </el-icon>
                                </el-text>

                            </el-tooltip>
                        </el-space>

                        <div style="margin: 20px 0"/>

                        <el-table :data="propertiesInfo.columnMappingInformations"
                                  style="width: 100%"
                                  max-height="250"
                                  @selection-change="handleSelectionChangeOfColumnMapping">

                            <el-table-column type="selection" width="55"/>
                            <el-table-column type="index"/>
                            <el-table-column prop="key" label="key">
                                <template #default="scope">
                                    <el-input v-model="scope.row.key"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="value" label="value">
                                <template #default="scope">
                                    <el-input v-model="scope.row.value"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="name" label="name">
                                <template #default="scope">
                                    <el-input v-model="scope.row.name"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column fixed="right" label="Operations">
                                <template #default="scope">
                                    <el-button
                                            link
                                            type="primary"
                                            size="small"
                                            @click.prevent="handleDeleteOfColumnMapping(scope.$index)"
                                    >
                                        Remove
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-button class="mt-4" style="width: 100%" @click="handleAddOfColumnMapping(keyValueNew)">
                            Add Item
                        </el-button>
                    </el-col>

                    <el-col :span="12">
                        <el-space size="10" spacer="|">
                            <el-tooltip
                                    content="自定义vm变量"
                                    placement="top">
                                <el-text>
                                    自定义映射
                                    <el-icon>
                                        <question-filled/>
                                    </el-icon>
                                </el-text>

                            </el-tooltip>
                        </el-space>

                        <div style="margin: 20px 0"/>

                        <el-table :data="propertiesInfo.basicInformations"
                                  style="width: 100%"
                                  max-height="300">

                            <el-table-column type="selection" width="55"/>
                            <el-table-column type="index"/>

                            <el-table-column prop="key" label="key">
                                <template #default="scope">
                                    <el-input v-model="scope.row.key"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="value" label="value">
                                <template #default="scope">
                                    <el-input v-model="scope.row.value"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="name" label="name">
                                <template #default="scope">
                                    <el-input v-model="scope.row.name"></el-input>
                                </template>
                            </el-table-column>

                            <el-table-column fixed="right" label="Operations">
                                <template #default="scope">
                                    <el-button
                                            link
                                            type="primary"
                                            size="small"
                                            @click.prevent="handleDeleteOfBasic(index)(scope.$index)"
                                    >
                                        Remove
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>

                        <el-button class="mt-4" style="width: 100%" @click="handleAddOfBasic">Add Item</el-button>
                    </el-col>

                </el-row>


            </el-tab-pane>

            <el-tab-pane label="生成模板" name="vm">
                <div style="margin-bottom: 20px">
                    <el-button type="primary" @click="addTab(editableTabsValue)">
                        add tab
                    </el-button>
                    <el-button type="primary" @click="handleUpdateOrSaveVms([getActiveTab()])">

                        保存当前编辑
                    </el-button>
                    <el-button type="primary"
                               @click="handlePreviewCode([getActiveTab()],data.propertiesInfo)">

                        预览当前编辑
                    </el-button>

                    <el-button type="primary"
                               style="float:right" @click="handleUpdateOrSaveVms(data.propertiesInfo.vms)"
                    >


                        保存全部文件
                    </el-button>
                    <el-button type="primary" style="float:right"
                               @click="handlePreviewCode(data.propertiesInfo.vms,data.propertiesInfo)">

                        预览全部文件
                    </el-button>
                </div>
                <el-tabs
                        v-model="editableTabsValue"
                        type="card"
                        closable
                        @tab-remove="removeTab"
                >
                    <el-tab-pane
                            v-for="item in editableTabs"
                            :key="item.id"
                            :label="item.name"
                            :name="item.id"
                    >

                        <el-form :model="item">
                            <el-row>

                                <el-col :span="6" style="margin-right: 20px;">
                                    <el-form-item prop="name">
                                        <template #label>
                                            模板名
                                        </template>
                                        <el-input v-model="item.name" placeholder="Please input"></el-input>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="12" style="margin-right: 20px;">
                                    <el-form-item>
                                        <template #label>
                                            绝对路径
                                            <el-tooltip
                                                    content="保证生成代码文件唯一，既如没有使用表相关变量，代码文件只会生成一次，适合生成工具类"
                                                    placement="top">
                                                <el-icon>
                                                    <question-filled/>
                                                </el-icon>
                                            </el-tooltip>
                                        </template>
                                        <el-input v-model="item.absoluteFilePath" placeholder="Please input">

                                        </el-input>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="4" style="margin-right: 20px;">
                                    <el-form-item>
                                        <template #label>
                                            拓展名
                                            <el-tooltip
                                                    content="生成文件拓展名"
                                                    placement="top">
                                                <el-icon>
                                                    <question-filled/>
                                                </el-icon>
                                            </el-tooltip>
                                        </template>

                                        <el-select
                                                v-model="item.fileExtension"
                                                filterable
                                                placeholder="请选择文件拓展名"
                                                style="width: 240px"
                                        >
                                            <el-option
                                                    v-for="item in ['java','sql','xml']"
                                                    :key="item"
                                                    :label="item"
                                                    :value="item"
                                            />
                                        </el-select>

                                    </el-form-item>
                                </el-col>

                            </el-row>
                        </el-form>


                        <div style="margin: 20px 0"/>

                        <el-input
                                v-model="item.value"
                                :autosize="{ minRows: 10 }"
                                type="textarea"
                                placeholder="请输入vm模板"
                        />

                    </el-tab-pane>
                </el-tabs>


            </el-tab-pane>

        </el-tabs>

        <el-form label-width="100px">
            <div style="text-align: center;margin-left:-100px;margin-top:10px;">
                <el-button type="primary" @click="submitForm()">提交</el-button>
                <el-button @click="close()">返回</el-button>
            </div>
        </el-form>


        <!-- 预览界面 -->
        <el-dialog :title="preview.title" v-model="preview.open" width="80%" top="5vh" append-to-body class="scrollbar">
            <el-tabs v-model="preview.activeName">
                <el-tab-pane
                        v-for="(value, key) in preview.data"
                        :label="value.fileName"
                        :name="value.absoluteFilePath"
                        :key="value.absoluteFilePath"
                >
                    <el-link :underline="false" icon="DocumentCopy" v-copyText="value.value"
                             v-copyText:callback="copyTextSuccess"
                    >&nbsp;复制
                    </el-link>
                    <highlightjs :language="value.fileType" :code="value.value"/>

                </el-tab-pane>
            </el-tabs>
        </el-dialog>

    </div>
</template>

<script setup name="GenConfigEdit">
import {
    getGenTable,
    getGenConfigInfo,
    updateGenTable,
    updateGenConfig,
    updateOrSaveVms,
    previewCode
} from "@/api/tool/gen";

import {useRoute} from "vue-router";
import {Delete} from "@element-plus/icons-vue";
import {optionselect as getDictOptionselect} from "@/api/system/dict/type.js";
import {copyGenConfig} from "@/api/system/genConfig.js";
import {deleteVms} from "@/api/system/vm.js";


const route = useRoute();
const {proxy} = getCurrentInstance();

const activeName = ref("genInfo");

const columns = ref([]);

const info = ref({});


const code = ref({
    "value": "CREATE TABLE `user_info` (\n  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',\n  `user_name` varchar(256) DEFAULT NULL COMMENT '用户昵称',\n  `user_account` varchar(256) NOT NULL COMMENT '账号',\n  `user_avatar` varchar(1024) DEFAULT NULL COMMENT '用户头像',\n  `gender` tinyint(4) DEFAULT NULL COMMENT '性别',\n  `user_role` varchar(256) NOT NULL DEFAULT 'user' COMMENT '用户角色：user/ admin',\n  `user_password` varchar(512) NOT NULL COMMENT '密码',\n  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',\n  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',\n  `is_delete` tinyint(4) NOT NULL DEFAULT '0' COMMENT '是否删除',\n  PRIMARY KEY (`id`) USING BTREE,\n  UNIQUE KEY `uni_userAccount` (`user_account`) USING BTREE\n) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户';",
    "type": "MySQL"
})
const data = reactive({
    propertiesInfo: {
        packagePath: undefined,
        moduleName: undefined,
        basicInformation: undefined,
        columnMappingInformation: undefined,
        basicInformations: [],
        columnMappingInformations: [],
    },
    preview: {
        open: false,
        title: "代码预览",
        data: {},
        activeName: "domain.java"
    }
});


const {
    propertiesInfo, preview
} = toRefs(data);


watch(
    () => data.propertiesInfo.basicInformations,
    (newVal, oldVal) => {
        data.propertiesInfo.basicInformation = JSON.stringify(data.propertiesInfo.basicInformations)
    }, {deep: true}
)

watch(
    () => data.propertiesInfo.columnMappingInformations,
    (newVal, oldVal) => {

        data.propertiesInfo.columnMappingInformation = JSON.stringify(data.propertiesInfo.columnMappingInformations)
    }, {deep: true}
)


class keyValue {
    name;
    key;
    value;

    constructor(name, key, value) {
        this.name = name;
        this.key = key;
        this.value = value;
    }
}

const keyValueNew = new keyValue(null, null, null);


let tabIndex = 0
const editableTabsValue = ref('2')
const editableTabs = ref([])


// 方法

function arrayAdd(array, ...data) {
    const copiedData = data.map(item => JSON.parse(JSON.stringify(item)));
    // const copiedData = JSON.parse(JSON.stringify(data));

    array.push(...copiedData)
}

function arrayDelete(array, index) {
    array.splice(index, 1)
}

function handleAddOfColumnMapping(newData) {
    arrayAdd(data.propertiesInfo.columnMappingInformations, newData)
}

function handleDeleteOfColumnMapping(index) {
    arrayDelete(data.propertiesInfo.columnMappingInformations, index)
}

function handleAddOfBasic(newData) {
    arrayAdd(data.propertiesInfo.basicInformations, newData)
}

function handleDeleteOfBasic(index) {
    arrayDelete(data.propertiesInfo.basicInformations, index)
}

// 修改or保存
function handleUpdateOrSaveVms(vms) {

    updateOrSaveVms(vms, data.propertiesInfo.id).then(res => {

        // 使用循环来复制属性
        for (let i = 0; i < res.length; i++) {
            // 将 res[i] 的属性复制到 vms[i]
            Object.keys(res[i]).forEach(key => {
                if (key === 'id') {
                    if (editableTabsValue.value === vms[i][key]) {
                        editableTabsValue.value = res[i][key];
                    }
                }
                vms[i][key] = res[i][key];
            });
        }
    });
}

function handlePreviewCode(vms, genConfigVo) {
    const request = {
        vms: vms,
        genConfigVO: genConfigVo,
        genConfig: genConfigVo,
    }
    previewCode(request).then(res => {
        preview.value.data = res;
        preview.value.open = true;

        console.log(preview.value.data)
        if (preview.value.data.length > 0) {
            preview.value.activeName = preview.value.data[0].absoluteFilePath
        }
        console.log(res);
    });
}

// 多选框选中数据
function handleSelectionChangeOfColumnMapping(selection) {

    ids.value = selection.map(item => item.id);
    values.value = selection.map(item => item);
    tableNames.value = selection.map(item => item.tableName);
    single.value = selection.length != 1;
    multiple.value = !selection.length;
}

/** 复制代码成功 */
function copyTextSuccess() {
    proxy.$modal.msgSuccess("复制成功");
    // proxy.$modal.msgSuccess((text != null && text != '') ? text : "复制成功");
}

/** 提交按钮 */
function submitForm() {


    const validateResult = validateProperties();
    if (validateResult) {
        data.propertiesInfo.basicInformation = JSON.stringify(data.propertiesInfo.basicInformations)
        data.propertiesInfo.columnMappingInformation = JSON.stringify(data.propertiesInfo.columnMappingInformations)
        updateGenConfig(data.propertiesInfo).then(res => {
            proxy.$modal.msgSuccess(res.msg);
            close();
        });
    } else {
        proxy.$modal.msgError("表单校验未通过，请重新检查提交内容");
    }

}

function validateProperties() {
    // 去除空格并检查 packagePath
    let trimmedpackagePath = data.propertiesInfo.packagePath ? data.propertiesInfo.packagePath.trim() : null;
    let packagePathIsValid = trimmedpackagePath !== null && trimmedpackagePath !== '';

    // 去除空格并检查 moduleName
    let trimmedModuleName = data.propertiesInfo.moduleName ? data.propertiesInfo.moduleName.trim() : null;
    let moduleNameIsValid = trimmedModuleName !== null && trimmedModuleName !== '';

    // 返回校验结果
    return packagePathIsValid && moduleNameIsValid;
}

function close() {
    const obj = {path: "/DBDog/genConfig", query: {t: Date.now(), pageNum: route.query.pageNum}};
    proxy.$tab.closeOpenPage(obj);
}


function doGetPropertiesInfo(id) {
    getGenConfigInfo(id).then(res => {
        data.propertiesInfo = res;
        editableTabs.value = data.propertiesInfo.vms;
        if (editableTabs.value.length > 0) {
            editableTabsValue.value = editableTabs.value[0].id
        }

    });
}


const addTab = (targetName) => {
    const newTabId = `${--tabIndex}`
    editableTabs.value.push({
        id: newTabId,
        name: "newTab" + newTabId,
        absoluteFilePath: "",
        value: "$author"
    })
    editableTabsValue.value = newTabId
}
const removeTab = (targetName) => {
    debugger
    const tabs = editableTabs.value
    let activeName = editableTabsValue.value

    proxy.$modal.confirm('是否删除？').then(function () {
        if (!targetName.startsWith('-')) {
            deleteVms([targetName]).then(() => {
                proxy.$modal.msgSuccess("删除成功");
            }).catch(() => {
            });
        }
        if (activeName === targetName) {
            tabs.forEach((tab, index) => {
                if (tab.id === targetName) {
                    const nextTab = tabs[index + 1] || tabs[index - 1]
                    if (nextTab) {
                        activeName = nextTab.id
                    }
                }
            })
        }
        editableTabsValue.value = activeName
        editableTabs.value = tabs.filter((tab) => tab.id !== targetName)

    });


}

function getActiveTab() {

    const tabs = editableTabs.value
    let activeName = editableTabsValue.value
    let activeTab
    tabs.forEach((tab, index) => {
        if (tab.id === activeName) {
            activeTab = tabs[index]
        }
    })
    return activeTab
}


(() => {
    const id = route.params && route.params.id;
    debugger
    if (id) {
        // 获取表详细信息
        doGetPropertiesInfo(id);
    }
})();


</script>

<style>
.demo-tabs > .el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
}
</style>
