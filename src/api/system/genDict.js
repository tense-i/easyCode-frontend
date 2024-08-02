import request from '@/utils/request'

// 分页获取当前用户创建的资源列表
export function listMyAddDictByPage(query) {
  return request({
    url: '/dict/my/add/list/page',
    method: 'get',
    params: query
  })
}

// 分页获取共享资源列表
export function listSharedDictByPage(query) {
  return request({
    url: '/dict/shared/list/page',
    method: 'get',
    params: query
  })
}

// 添加词库
export function addGenDict(data) {
  return request({
    url: '/dict/add',
    method: 'post',
    data: data
  })
}


// 更新词库
export function updateGenDict(data) {
  return request({
    url: '/dict/update',
    method: 'post',
    data: data
  })
}

// 删除词库s
export function deleteGenDict(data) {
  return request({
    url: '/dict/delete',
    method: 'post',
    data: data
  })
}

// 复制词库s
export function copyGenDict(data) {
  return request({
    url: '/dict/copy',
    method: 'post',
    data: data
  })
}



