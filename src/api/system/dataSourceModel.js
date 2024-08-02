import request from '@/utils/request'

// 保存或更新 连接信息
export function updateOrSaveDataSourceModel(data) {
    return request({
        url: '/dbdog/datasourcemodel/updateOrSave',
        method: 'post',
        data:data
    })
}

// 删除 连接信息
export function deleteDataSourceModel(data) {
    return request({
        url: '/dbdog/datasourcemodel/delete',
        method: 'delete',
        data:data
    })
}

// 连接信息 list
export function listDataSourceModel(query) {
    return request({
        url: '/dbdog/datasourcemodel/list',
        method: 'get',
        params:query
    })
}


