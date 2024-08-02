import request from '@/utils/request'

// 查询生成表数据
export function listTable(query) {
    return request({
        url: '/tool/gen/list',
        method: 'get',
        params: query
    })
}


// 查询db数据库列表
export function listDbTable(query) {
    return request({
        url: '/tool/gen/db/list',
        method: 'get',
        params: query
    })
}

// 查询表详细信息
export function getGenTable(tableId) {
    return request({
        url: '/tool/gen/' + tableId,
        method: 'get'
    })
}

// 修改代码生成信息
export function updateGenTable(data) {
    return request({
        url: '/tool/genTable',
        method: 'put',
        data: data
    })
}

// 导入表
export function importTable(data) {
    return request({
        url: '/tool/gen/importTable',
        method: 'post',
        params: data
    })
}

// 预览生成代码
export function previewTable(tableId) {
    return request({
        url: '/tool/gen/preview/' + tableId,
        method: 'get'
    })
}

// 删除表数据
export function delTable(tableId) {
    return request({
        url: '/tool/gen/' + tableId,
        method: 'delete'
    })
}

// 生成代码（自定义路径）
export function genCode(tableName) {
    return request({
        url: '/tool/gen/genCode/' + tableName,
        method: 'get'
    })
}

// 同步数据库
export function synchDb(tableName) {
    return request({
        url: '/tool/gen/synchDb/' + tableName,
        method: 'get'
    })
}

// 根据 SQL 获取 schema
export function getSchemaBySql(data) {
    return request({
        url: '/sql/get/schema/sql',
        method: 'post',
        data: data
    })
}

// 根据 SQL 获取 genTable
export function getGenTableBySql(data) {
    return request({
        url: '/sql/get/genTable/sql',
        method: 'post',
        data: data
    })
}

// 根据 SQL 获取 schema
export function getSchemaBySqls(data) {
    return request({
        url: '/sql/get/schema/sql-s',
        method: 'post',
        data: data
    })
}


// 根据 schema 获取 生成数据
export function generateBySchemaV2(data) {
    return request({
        url: '/sql/generate/schema2',
        method: 'post',
        data: data
    })
}

// 根据 schema 获取 生成数据
export function generateBySchemaV3(data) {
    return request({
        url: '/sql/generate/schema3',
        method: 'post',
        data: data
    })
}

// 根据 schema 获取 生成数据
export function generateBySchemaV4(data) {
    return request({
        url: '/sql/generate/schema4',
        method: 'post',
        data: data
    })
}


// 查询表详细信息
export function getGenConfigInfo(id) {
    return request({
        url: '/dbdog/genConfig/info/' + id,
        method: 'get'
    })
}

// 查询生成代码配置列表
export function pageGenConfig(query) {
    return request({
        url: '/dbdog/genConfig/list',
        method: 'get',
        params: query
    })
}

// 修改代码生成配置信息
export function updateGenConfig(data) {
    return request({
        url: '/dbdog/genConfig',
        method: 'put',
        data: data
    })
}

// 修改生成模板信息
export function updateOrSaveVms(data,genConfigId) {
    return request({
        url: '/dbdog/vm/updateOrSave',
        method: 'post',
        data: data,
        params:{genConfigId:genConfigId}
    })
}

// 预览
export function previewCode(data) {
    return request({
        url: '/dbdog/generator/previewCode',
        method: 'post',
        data: data
    })
}

