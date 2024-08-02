import request from '@/utils/request'


// 查询生成表数据
export function pageGenTable(query) {
    return request({
        url: '/tool/genTable/pageGenTable',
        method: 'get',
        params: query
    })
}

// 复制 配置信息
export function copyGenConfig(data) {
    return request({
        url: '/dbdog/genConfig/copy',
        method: 'post',
        data: data
    })
}

// 删除 配置信息
export function deleteGenConfig(data) {
    return request({
        url: '/dbdog/genConfig/delete',
        method: 'delete',
        data: data
    })
}

// 创建 空配置信息
export function addNewGenConfig() {
    return request({
        url: '/dbdog/genConfig/addNew',
        method: 'post'
    })
}

// 查询生成代码配置列表(用户创建)
export function pageGenConfig(query) {
    return request({
        url: '/dbdog/genConfig/list',
        method: 'get',
        params: query
    })
}

// 查询生成代码配置列表（在线共享）
export function pageSharedGenConfig(query) {
    return request({
        url: '/dbdog/genConfig/shared/pageGenConfig',
        method: 'get',
        params: query
    })
}
