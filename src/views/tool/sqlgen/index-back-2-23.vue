<template>
    <div class="app-container">

        <!--  生成按键       -->
        <el-row class="mb-4" style="display: flex; justify-content: space-between;">
            <el-text class="mx-1" type="success" size="large">SQL生成器</el-text>
            <el-row class="mb-4" justify="end">
                <el-button type="primary" round @click="handleGenerateBySchemaV3">一键生成</el-button>
                <el-button type="success" round>Success</el-button>
                <el-button type="info" round>Info</el-button>
                <el-button type="warning" round>Warning</el-button>
                <el-button type="danger" round>Danger</el-button>
            </el-row>
        </el-row>

        <el-row :gutter="10" class="mb8">

            <el-col :span="1.5">
                <el-button
                        type="primary"
                        plain
                        icon="Download"
                        @click="handleGenTable"
                        v-hasPermi="['tool:gen:code']"
                >生成
                </el-button>
            </el-col>
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
                        type="info"
                        plain
                        icon="Upload"
                        @click="openImportTable"
                        v-hasPermi="['tool:gen:import']"
                >导入建表SQL
                </el-button>
            </el-col>

            <el-col :span="1.5">
                <el-button
                        type="danger"
                        plain
                        icon="Delete"
                        :disabled="multiple"
                        @click="handleDelete"
                        v-hasPermi="['tool:gen:remove']"
                >删除
                </el-button>
            </el-col>


        </el-row>

        <div style="margin: 20px 0"/>

        <div class="demo-collapse" style="margin-bottom: 20px;">
            <el-collapse v-for="(p,index) in tableSchemaList" :key="index">
                <el-collapse-item :name=index>

                    <template #title>

                        <el-row class="mb-4" :gutter="10">
                            <el-col :span="6">
                                 <span class="ml-3 w-35 text-gray-600 inline-flex items-center"
                                 >表名称</span
                                 >
                            </el-col>
                            <el-col :span="12">
                                <el-input
                                        v-model="p.tableName"
                                        placeholder="请输入表名称"
                                        clearable
                                        @keyup.enter="handleQuery"
                                />
                            </el-col>
                            <el-col :span="1.5">
                                <el-button
                                        type="danger"
                                        plain
                                        icon="Delete"
                                        @click="handleDelete(tableSchemaList,index)"
                                >
                                </el-button>
                            </el-col>
                        </el-row>

                    </template>


                    <!--     表信息       -->
                    <div class="centered-98">
                        <el-form :model="p" ref="queryRef" :inline="true" v-show="showSearch">
                            <el-form-item label="库名称" prop="dbName">
                                <el-input
                                        v-model="p.dbName"
                                        placeholder="请输入表名称"
                                        clearable
                                        style="width: 200px"
                                        @keyup.enter="handleQuery"
                                />
                            </el-form-item>
                            <el-form-item label="表名称" prop="tableName">
                                <el-input
                                        v-model="p.tableName"
                                        placeholder="请输入表名称"
                                        clearable
                                        style="width: 200px"
                                        @keyup.enter="handleQuery"
                                />
                            </el-form-item>
                            <el-form-item label="表描述" prop="tableComment">
                                <el-input
                                        v-model="p.tableComment"
                                        placeholder="请输入表描述"
                                        clearable
                                        style="width: 200px"
                                        @keyup.enter="handleQuery"
                                />
                            </el-form-item>
                            <el-form-item label="模拟条数" prop="mockNum">
                                <el-input-number
                                        v-model="p.mockNum"
                                        class="mx-4"
                                        :min="1"
                                        :max="100"
                                        controls-position="right"
                                        @change="handleChange"
                                />
                            </el-form-item>

                            <el-select
                                    v-model="p.dbType"
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
                        </el-form>
                    </div>
                    <!--        字段    -->
                    <div class="centered-90">
                        <el-divider>
                            ({{ p.tableName }})表字段配置
                        </el-divider>
                        <div class="demo-collapse">
                            <el-collapse v-for="(field,fieldIndex) in p.columns">
                                <el-collapse-item :name=fieldIndex>

                                    <template #title>
                                        <el-row class="mb-4" :gutter="10">
                                            <el-col :span="6">
                                                <span class="ml-3 w-35 text-gray-600 inline-flex items-center">字段名</span>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-input
                                                        v-model="field.columnName"
                                                        placeholder="请输入字段名"
                                                        clearable
                                                        @keyup.enter="handleQuery"
                                                />
                                            </el-col>
                                            <el-col :span="1.5">
                                                <el-button
                                                        type="danger"
                                                        plain
                                                        icon="Delete"
                                                        @click="handleDelete(p.columns,fieldIndex)"
                                                >
                                                </el-button>
                                            </el-col>
                                        </el-row>
                                    </template>
                                    <columnFrom :column="field" inline="true"></columnFrom>
<!--                                    <el-form :model="field" ref="queryRef" :inline="true" v-show="showSearch">-->

<!--                                        <el-form-item label="字段名" prop="columnName">-->
<!--                                            <el-input-->
<!--                                                    v-model="field.columnName"-->
<!--                                                    placeholder="请输入字段名称"-->
<!--                                                    clearable-->
<!--                                                    style="width: 200px"-->
<!--                                                    @keyup.enter="handleQuery"-->
<!--                                            />-->
<!--                                        </el-form-item>-->

<!--                                        <el-form-item label="字段类型" prop="columnType">-->
<!--                                            <el-input-->
<!--                                                    v-model="field.columnType"-->
<!--                                                    placeholder="请输入字段名称"-->
<!--                                                    clearable-->
<!--                                                    style="width: 200px"-->
<!--                                                    @keyup.enter="handleQuery"-->
<!--                                            />-->
<!--                                        </el-form-item>-->

<!--                                        <el-form-item label="默认值" prop="defaultValue">-->
<!--                                            <el-input-->
<!--                                                    v-model="field.defaultValue"-->
<!--                                                    placeholder="要与字段类型匹配"-->
<!--                                                    clearable-->
<!--                                                    style="width: 200px"-->
<!--                                                    @keyup.enter="handleQuery"-->
<!--                                            />-->
<!--                                        </el-form-item>-->

<!--                                        <el-form-item label="字段备注" prop="comment">-->
<!--                                            <el-input-->
<!--                                                    v-model="field.comment"-->
<!--                                                    placeholder="字段备注"-->
<!--                                                    clearable-->
<!--                                                    style="width: 200px"-->
<!--                                                    @keyup.enter="handleQuery"-->
<!--                                            />-->
<!--                                        </el-form-item>-->

<!--                                        <el-form-item label="非空" prop="isRequired">-->
<!--                                            <el-switch-->
<!--                                                    v-model="field.isRequired"-->
<!--                                                    inline-prompt-->
<!--                                                    active-text="是"-->
<!--                                                    inactive-text="否"-->
<!--                                            />-->
<!--                                        </el-form-item>-->

<!--                                        <el-form-item label="主键" prop="isPk">-->
<!--                                            <el-switch-->
<!--                                                    v-model="field.isPk"-->
<!--                                                    inline-prompt-->
<!--                                                    active-text="是"-->
<!--                                                    inactive-text="否"-->
<!--                                            />-->
<!--                                        </el-form-item>-->

<!--                                        <el-form-item label="自增" prop="isIncrement">-->
<!--                                            <el-switch-->
<!--                                                    v-model="field.isIncrement"-->
<!--                                                    inline-prompt-->
<!--                                                    active-text="是"-->
<!--                                                    inactive-text="否"-->
<!--                                            />-->
<!--                                        </el-form-item>-->

<!--                                        <el-form-item label="模拟类型" prop="mockNum">-->
<!--                                            <el-select-->
<!--                                                    v-model="field.mockType"-->
<!--                                                    filterable-->
<!--                                                    placeholder="模拟类型"-->
<!--                                                    style="width: 240px"-->
<!--                                            >-->
<!--                                                &lt;!&ndash;                                                <el-option-->
<!--                                                                                                        v-for="item in simulationTypeOptions"-->
<!--                                                                                                        :key="item.value"-->
<!--                                                                                                        :label="item.value"-->
<!--                                                                                                        :value="item.value"-->
<!--                                                                                                />&ndash;&gt;-->
<!--                                                <el-option-->
<!--                                                        v-for="item in simulationTypeOptions1"-->
<!--                                                        :key="item"-->
<!--                                                        :label="item"-->
<!--                                                        :value="item"-->
<!--                                                />-->
<!--                                            </el-select>-->
<!--                                        </el-form-item>-->

<!--                                        <el-form-item label="固定值" prop="mockParams"-->
<!--                                                      v-if="field.mockType === '固定'">-->
<!--                                            <el-input-->
<!--                                                    v-model="field.mockParam1"-->
<!--                                                    placeholder="请输入固定值"-->
<!--                                                    clearable-->
<!--                                                    style="width: 200px"-->
<!--                                                    @keyup.enter="handleQuery"-->
<!--                                            />-->
<!--                                        </el-form-item>-->

<!--                                        <el-form-item label="随机规则" prop="mockParams"-->
<!--                                                      v-if="field.mockType === '随机'">-->
<!--                                            <el-select-->
<!--                                                    v-model="field.mockParam1"-->
<!--                                                    filterable-->
<!--                                                    placeholder="模拟类型"-->
<!--                                                    style="width: 240px"-->
<!--                                            >-->

<!--                                                <el-option-->
<!--                                                        v-for="item in simulationTypeOptions1"-->
<!--                                                        :key="item"-->
<!--                                                        :label="item"-->
<!--                                                        :value="item"-->
<!--                                                />-->
<!--                                            </el-select>-->
<!--                                        </el-form-item>-->

<!--                                        <el-form-item label="起始值" prop="mockParams"-->
<!--                                                      v-if="field.mockType === '递增'">-->
<!--                                            <el-input-number-->
<!--                                                    v-model="p.mockParam1"-->
<!--                                                    class="mx-4"-->
<!--                                                    controls-position="right"-->
<!--                                                    @change="handleChange"-->
<!--                                            />-->
<!--                                        </el-form-item>-->

<!--                                        <el-form-item label="规则" prop="mockParams"-->
<!--                                                      v-if="field.mockType === '规则'">-->
<!--                                            <el-input-->
<!--                                                    v-model="field.mockParam1"-->
<!--                                                    placeholder="请输入正则表达式"-->
<!--                                                    clearable-->
<!--                                                    style="width: 200px"-->
<!--                                                    @keyup.enter="handleQuery"-->
<!--                                            />-->
<!--                                        </el-form-item>-->

<!--                                        <el-form-item label="词库" prop="mockParams"-->
<!--                                                      v-if="field.mockType === '词库'">-->
<!--                                            <el-select-->
<!--                                                    v-model="field.mockParam1"-->
<!--                                                    filterable-->
<!--                                                    placeholder="模拟类型"-->
<!--                                                    style="width: 240px"-->
<!--                                            >-->

<!--                                                <el-option-->
<!--                                                        v-for="item in simulationTypeOptions1"-->
<!--                                                        :key="item"-->
<!--                                                        :label="item"-->
<!--                                                        :value="item"-->
<!--                                                />-->
<!--                                            </el-select>-->
<!--                                        </el-form-item>-->

<!--                                        <el-form-item label="表名" prop="mockParams"-->
<!--                                                      v-if="field.mockType === '关联'">-->
<!--                                            <el-select-->
<!--                                                    v-model="field.mockParam1"-->
<!--                                                    filterable-->
<!--                                                    placeholder="模拟类型"-->
<!--                                                    style="width: 240px"-->
<!--                                            >-->
<!--                                                <el-option-->
<!--                                                        v-for="(item,index) in tableSchemaList"-->
<!--                                                        :key="index"-->
<!--                                                        :label="item.tableName"-->
<!--                                                        :value="index"-->
<!--                                                />-->
<!--                                            </el-select>-->
<!--                                        </el-form-item>-->

<!--                                        <el-form-item label="字段名" prop="mockParams"-->
<!--                                                      v-if="field.mockType === '关联'&& tableSchemaList[field.mockParam1]">-->
<!--                                            <el-select-->
<!--                                                    v-model="field.mockParam2"-->
<!--                                                    filterable-->
<!--                                                    placeholder="模拟类型"-->
<!--                                                    style="width: 240px"-->
<!--                                            >-->

<!--                                                <el-option-->
<!--                                                        v-for="(item,index) in tableSchemaList[field.mockParam1]['columns']"-->
<!--                                                        :key="item"-->
<!--                                                        :label="item.columnName"-->
<!--                                                        :value="index"-->
<!--                                                />-->
<!--                                            </el-select>-->
<!--                                        </el-form-item>-->

<!--                                        <el-form-item label="对应关系" prop="mockParams"-->
<!--                                                      v-if="field.mockType === '关联'">-->
<!--                                            <el-input-->
<!--                                                    v-model="field.mockParam3"-->
<!--                                                    placeholder="请输入正则表达式"-->
<!--                                                    clearable-->
<!--                                                    style="width: 200px"-->
<!--                                                    @keyup.enter="handleQuery"-->
<!--                                            />-->
<!--                                        </el-form-item>-->

<!--                                    </el-form>-->

                                    <el-divider content-position="right" border-style="dashed">
                                        ({{ p.tableName }})表字段配置
                                    </el-divider>

                                </el-collapse-item>
                            </el-collapse>
                        </div>

                        <!--       添加字段按键             -->
                        <div class="centered-90">
                            <el-col class="my-4">
                                <el-button round @click="handleAddField(p,fieldNew)" class="centered-90">新增字段
                                </el-button>
                            </el-col>
                            <el-col class="my-4">
                                <el-button round @click="handleImportField(p)"
                                           class="centered-90">
                                    导入字段
                                </el-button>
                            </el-col>
                            <el-col class="my-4">
                                <!--                        <el-button round @click="handleAddField(p,fieldId)>导入字段</el-button>-->
                                <el-button round
                                           @click="handleAddField(p,fieldId,fieldCreateTime,fieldUpdateTime,fieldIsDelete)"
                                           class="centered-90">
                                    新增通用字段
                                </el-button>
                            </el-col>
                        </div>


                    </div>
                </el-collapse-item>
            </el-collapse>
        </div>

        <!--        加表按键-->
        <div class="centered-90">
            <el-col class="my-4">
                <el-button round @click="openImportTable" class="centered-90">导入表</el-button>

                <!--                        <el-button round @click="handleAddField(p,fieldId)>导入字段</el-button>-->
                <!--            <el-button round @click="handleAddField(p,fieldId,fieldCreateTime,fieldUpdateTime,fieldIsDelete)">新增通用字段</el-button>-->
            </el-col>
            <el-col class="my-4">
                <el-button round @click="handleAddTableSchema(tableSchemaList,tableSchemaNew)" class="centered-90">新增表
                </el-button>

                <!--                        <el-button round @click="handleAddField(p,fieldId)>导入字段</el-button>-->
                <!--            <el-button round @click="handleAddField(p,fieldId,fieldCreateTime,fieldUpdateTime,fieldIsDelete)">新增通用字段</el-button>-->
            </el-col>

        </div>

        <!--        数据展示-->
        <template v-if="sqlCodeFlag&&!isEmpty(sqlCode)">
            <el-select
                    v-model="showTableName"
                    filterable
                    placeholder="选择展示数据"
                    style="width: 240px"
                    v-if="!isEmpty(sqlCode)"
                    default="all">
                <el-option
                        v-for="key in sqlCode"
                        :key="key.tableName"
                        :label="key.tableName"
                        :value="key.tableName"/>
            </el-select>
            <div style="margin: 20px 0"/>
            <el-tabs v-model="tabsOptions.show" type="border-card">
                <el-tab-pane
                        v-for="item in tabsOptions.list"
                        :label="item.valueKey"
                        :name="item.valueKey"
                        :key="item.valueKey"
                >

                    <el-link :underline="false" icon="DocumentCopy"
                             v-copyText="sqlCode[showTableName][item.valueKey]"
                             v-copyText:callback="copyTextSuccess" style="float:right">&nbsp;复制
                    </el-link>
                    <pre>{{ sqlCode[showTableName][item.valueKey] }}</pre>
                </el-tab-pane>
            </el-tabs>
        </template>

        <!--    导入表    -->
        <import-table ref="importRef" @ok="handleQuery"/>

        <!--        导入字段-->
        <el-dialog
                v-model="dialogOverflowVisibleColumn"
                title="Tips"
                width="80%"
                draggable
                overflow>

            <el-tabs type="border-card">

                <!--                直接导入-->
                <el-tab-pane label="直接导入">
                    <div>
                        <el-form :model="pageGenTableColumnQueryParams" ref="queryRef" :inline="true">
                            <el-form-item label="字段称" prop="tableName">
                                <el-input
                                        v-model="pageGenTableColumnQueryParams.searchName"
                                        placeholder="请输入字段名称"
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
                                <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                                <el-button icon="Refresh" @click="resetQuery">重置</el-button>
                            </el-form-item>
                        </el-form>

                        <el-table :data="pageGenTableColumnData.records" @selection-change="handleSelectionChange">
                            <el-table-column type="selection" align="center" width="55"></el-table-column>
                            <el-table-column label="序号" type="index" width="50" align="center">
                                <template #default="scope">
                                    <span>{{
                                        (pageGenTableColumnQueryParams.current - 1) * pageGenTableColumnQueryParams.pageSize + scope.$index + 1
                                        }}</span>
                                </template>
                            </el-table-column>

                            <el-table-column
                                    label="字段名称"
                                    align="center"
                                    prop="columnName"
                                    :show-overflow-tooltip="true"
                            />

                            <el-table-column
                                    label="字段描述"
                                    align="center"
                                    prop="columnComment"
                                    :show-overflow-tooltip="true"
                            />

                            <el-table-column label="操作" align="center" width="330"
                                             class-name="small-padding fixed-width">
                                <template #default="scope">
                                    <el-tooltip content="导入" placement="top">
                                        <el-button link type="primary" icon="Plus"
                                                   @click="handleAddField(data.p.pTableSchema,scope.row)"
                                                   v-hasPermi="['tool:gen:preview']"></el-button>
                                    </el-tooltip>
                                    <el-tooltip content="编辑" placement="top">
                                        <el-button link type="primary" icon="Edit"
                                                   @click="handleEditColumn(scope.row)"></el-button>
                                    </el-tooltip>
                                    <el-tooltip content="删除" placement="top">
                                        <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                                                   v-hasPermi="['tool:gen:remove']"></el-button>
                                    </el-tooltip>
                                    <el-tooltip content="同步" placement="top">
                                        <el-button link type="primary" icon="Refresh" @click="handleSynchDb(scope.row)"
                                                   v-hasPermi="['tool:gen:edit']"></el-button>
                                    </el-tooltip>
                                    <el-tooltip content="生成代码" placement="top">
                                        <el-button link type="primary" icon="Download"
                                                   @click="handleGenTable(scope.row)"
                                                   v-hasPermi="['tool:gen:code']"></el-button>
                                    </el-tooltip>
                                </template>
                            </el-table-column>
                        </el-table>
                        <pagination
                                v-show="pageGenTableColumnData.total>0"
                                :total="pageGenTableColumnData.total"
                                v-model:page="pageGenTableColumnQueryParams.current"
                                v-model:limit="pageGenTableColumnQueryParams.pageSize"
                                @pagination="handelPageGenTableColumn"
                        />
                    </div>
                </el-tab-pane>
                <!--                从表中导入-->
                <el-tab-pane label="从表中导入">

                    <el-form :model="pageGenTableQueryParams" ref="queryRef" :inline="true">

                        <el-form-item label="表名称" prop="tableName">
                            <el-input
                                    v-model="pageGenTableQueryParams.tableName"
                                    placeholder="请输入表名称"
                                    clearable
                                    @keyup.enter="handleQuery"
                            />
                        </el-form-item>


                        <el-form-item label="表描述" prop="tableComment">
                            <el-input
                                    v-model="pageGenTableQueryParams.tableComment"
                                    placeholder="请输入表描述"
                                    clearable
                                    @keyup.enter="handleQuery"
                            />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="Search" @click="handlePageGenTable">搜索</el-button>
                            <!--                        <el-button icon="Refresh" @click="resetQuery">重置</el-button>-->
                            <el-button type="primary" @click="handlePageGenTable">导入</el-button>
                        </el-form-item>
                    </el-form>

                    <el-table :data="pageGenTableData.records" style="width: 100%">

                        <el-table-column type="expand">
                            <template #default="props">
                                <div m="4">
                                    <el-table :data="props.row.columns" :border="childBorder">
                                        <el-table-column type="selection" align="center" width="55"></el-table-column>


                                        <el-table-column
                                                fixed
                                                label="字段名称"
                                                align="center"
                                                prop="columnName"
                                                :show-overflow-tooltip="true"
                                        />

                                        <el-table-column
                                                label="字段描述"
                                                align="center"
                                                prop="columnComment"
                                                :show-overflow-tooltip="true"
                                        />

                                        <el-table-column label="操作" align="center" width="330"
                                                         class-name="small-padding fixed-width">
                                            <template #default="scope">
                                                <el-tooltip content="导入" placement="top">
                                                    <el-button link type="primary" icon="Plus"
                                                               @click="handleAddField(data.p.pTableSchema,scope.row)"
                                                               v-hasPermi="['tool:gen:preview']"></el-button>
                                                </el-tooltip>
                                                <el-tooltip content="编辑" placement="top">
                                                    <el-button link type="primary" icon="Edit"
                                                               @click="handleEditColumn(scope.row)"></el-button>
                                                </el-tooltip>
                                                <el-tooltip content="删除" placement="top">
                                                    <el-button link type="primary" icon="Delete"
                                                               @click="handleDelete(scope.row)"
                                                               v-hasPermi="['tool:gen:remove']"></el-button>
                                                </el-tooltip>
                                                <el-tooltip content="同步" placement="top">
                                                    <el-button link type="primary" icon="Refresh"
                                                               @click="handleSynchDb(scope.row)"
                                                               v-hasPermi="['tool:gen:edit']"></el-button>
                                                </el-tooltip>
                                                <el-tooltip content="生成代码" placement="top">
                                                    <el-button link type="primary" icon="Download"
                                                               @click="handleGenTable(scope.row)"
                                                               v-hasPermi="['tool:gen:code']"></el-button>
                                                </el-tooltip>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </template>
                        </el-table-column>
                        @selection-change="handleSelectionChange" height="260px">
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column prop="tableName" label="表名称"
                                         :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column prop="tableComment" label="表描述"
                                         :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column prop="createTime" label="创建时间"></el-table-column>
                        <el-table-column prop="updateTime" label="更新时间"></el-table-column>
                    </el-table>
                    <pagination
                            v-show="total>0"
                            :total="total"
                            v-model:page="pageGenTableQueryParams.current"
                            v-model:limit="pageGenTableQueryParams.pageSize"
                            @pagination="handlePageGenTable"
                    />
                </el-tab-pane>
            </el-tabs>
        </el-dialog>

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

<script setup name="Gen">
import {
    listTable,
    previewTable,
    delTable,
    genCode,
    synchDb,
    generateBySchemaV2,
    generateBySchemaV3
} from "@/api/tool/gen";
import router from "@/router";
import importTable from "./importTable";
import {isEmpty} from "element-plus/es/utils/index";
import {Calendar, Delete} from "@element-plus/icons-vue";
import {splice} from "@/utils/objectUtils.js";
import {pageGenTable, pageGenTableColumn} from "@/api/system/genTableColumn.js";
import ColumnFrom from "@/components/SqlGen/columnFrom.vue";


// 定义字段对象
class Filed {
    columnName;
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

    constructor(columnName, columnType, defaultValue, isRequired, comment, isPk, isIncrement, mockType, mockParams, onUpdate) {
        this.columnName = columnName;
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
const fieldNew = new Filed(null, null, null, false, null, false, false, "不模拟", null, null);
// 通用字段 - 主键
const fieldId = new Filed("id", "bigint(20)", null, true, "主键", true, false, "不模拟", null, null);
// 通用字段 - 创建时间
const fieldCreateTime = new Filed("create_time", "datetime", "CURRENT_TIMESTAMP", true, "创建时间", false, false, "不模拟", null, null);
// 通用字段 - 更新时间
const fieldUpdateTime = new Filed("update_time", "datetime", "CURRENT_TIMESTAMP", true, "更新时间", false, false, "不模拟", null, null);
// 通用字段 - 逻辑删除
const fieldIsDelete = new Filed("is_delte", "tinyint", 0, true, "是否逻辑删除 (o-否;1-是 )", false, false, "不模拟", null, null);

class TableSchema {
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
const tableSchemaNew = new TableSchema("MySQL", null, null, null, 20, []);


const route = useRoute();
const {proxy} = getCurrentInstance();

const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const tableNames = ref([]);
const tableNum = ref(20);
const dateRange = ref([]);
const uniqueId = ref("");
const dialogSaveColumn = ref(false);

const dbTypeOptions = [
    {
        value: 'MySQL',
        label: 'MySQL',
    },
    {
        value: 'PostgreSQL',
        label: 'PostgreSQL',
    }
]


const simulationTypeOptions = [
    {
        value: '固定',
        label: '固定',
    },
    {
        value: '不模拟',
        label: '不模拟',
    },
]
const simulationTypeOptions1 = [
    "不模拟",
    "递增",
    "固定",
    "随机",
    "规则",
    "词库",
    "关联"
]


const tabsOptions = {
    show: 'insertSql',
    list: [
        {
            tabName: 'insertSql',
            valueKey: 'insertSql',
        },
        {
            tabName: 'createSql',
            valueKey: 'createSql',
        }
    ]
}

const dialogOverflowVisibleColumn = ref(false)
const innerdialogOverflowVisibleColumn = ref(false)


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
    }, pageGenTableData: {
        records: [],
        total: 0
    }, pageGenTableColumnData: {
        records: [],
        total: 0
    }

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
    pageGenTableColumnData
} = toRefs(data);

const radiusGroup = ref([
    {
        name: 'No Radius',
        type: '',
    },
    {
        name: 'Small Radius',
        type: 'small',
    },
    {
        name: 'Large Radius',
        type: 'base',
    },
    {
        name: 'Round Radius',
        type: 'round',
    },
])

const getValue = (type) => {
    const getCssVarValue = (prefix, type) =>
        getComputedStyle(document.documentElement).getPropertyValue(
            `--el-${prefix}-${type}`
        )
    return getCssVarValue('border-radius', type)
}

onActivated(() => {
    const time = route.query.t;
    if (time != null && time != uniqueId.value) {
        uniqueId.value = time;
        queryParams.value.current = Number(route.query.pageNum);
        dateRange.value = [];
        proxy.resetForm("queryForm");
        getList();
    }
})

/** 是否存在于simulationTypeOptions1 */
function simulationTypeIndexOf(x) {
    return simulationTypeOptions1.indexOf(x) != -1;

}

function getList() {
    loading.value = true;
    pageGenTableColumn(proxy.addDateRange(queryParams.value, dateRange.value)).then(response => {
        tableListField.value = response.data.records;
        total.value = response.data.total;
        loading.value = false;
    });
}

function handelPageGenTableColumn() {
    loading.value = true;
    pageGenTableColumn(proxy.addDateRange(pageGenTableColumnQueryParams.value, dateRange.value)).then(response => {
        data.pageGenTableColumnData.records = response.data.records;
        data.pageGenTableColumnData.total = response.data.total;
    });
}

function handlePageGenTable() {
    loading.value = true;
    pageGenTable(proxy.addDateRange(pageGenTableQueryParams.value, dateRange.value)).then(response => {
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
        genCode(row.tableName).then(response => {
            proxy.$modal.msgSuccess("成功生成到自定义路径：" + row.genPath);
        });
    } else {
        proxy.$download.zip("/tool/gen/batchGenCode?tables=" + tbNames, "ruoyi.zip");
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
    proxy.$modal.confirm('确认要强制同步"' + tableName + '"表结构吗？').then(function () {
        return synchDb(tableName);
    }).then(() => {
        proxy.$modal.msgSuccess("同步成功");
    }).catch(() => {
    });
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

// 多选框选中数据
function handleSelectionChange(selection) {
    ids.value = selection.map(item => item.tableId);
    tableNames.value = selection.map(item => item.tableName);
    single.value = selection.length != 1;
    multiple.value = !selection.length;
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

/** 删除按钮操作 */
function handleDelete(array, index) {
    splice(array, index);
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

/** 生成sql代码操作 */
function handleGenerateBySchemaV3() {
    generateBySchemaV3(tableSchemaList.value).then(res => {
        data.sqlCode = res.data;
        data.sqlCodeFlag = true;
        data.showTableName = "all";
    });
}

/** 添加字段操作 */
function handleAddField(tableSchema, ...fileds) {

    const copiedFileds = fileds.map(filed => JSON.parse(JSON.stringify(filed)));
    tableSchema.columns.push(...copiedFileds)
}

/** 导入字段操作 */
function handleImportField(tableSchema) {

    //  修改当前的操作表对象
    data.p.pTableSchema = tableSchema;
    dialogOverflowVisibleColumn.value = true;
    handlePageGenTable();
    handelPageGenTableColumn();
}

/** 添加表操作 */
function handleAddTableSchema(tableSchemaList, ...tableSchemas) {
    // 深拷贝
    const copiedTableSchemas = tableSchemas.map(schema => JSON.parse(JSON.stringify(schema)));
    tableSchemaList.push(...copiedTableSchemas);

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

getList();
</script>
<style scoped>
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

.centered-98 {
    width: 90%;
    margin: 0 auto;
}

.centered-90 {
    width: 90%;
    margin: 0 auto;
}
</style>
